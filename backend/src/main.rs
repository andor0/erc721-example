use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};
use ethabi::ParamType;
use hex_literal::hex;
use serde::Serialize;
use serde_json::json;
use std::{
    net::SocketAddr,
    sync::{Arc, RwLock},
};
use web3::{
    error::Error as Web3Error,
    futures::{future, StreamExt},
    types::{FilterBuilder, H256},
};

// web3.utils.keccak256('CollectionCreated(address,string,string)')
const TOPIC_COLLECTION_CREATED: H256 = H256(hex!(
    "3454b57f2dca4f5a54e8358d096ac9d1a0d2dab98991ddb89ff9ea1746260617"
));
// web3.utils.keccak256('TokenMinted(address,address,uint256,string)')
const TOPIC_TOKEN_MINTED: H256 = H256(hex!(
    "c9fee7cd4889f66f10ff8117316524260a5242e88e25e0656dfb3f4196a21917"
));

type Events = Vec<Event>;

#[derive(Serialize)]
enum Event {
    CollectionCreated {
        collection: String,
        name: String,
        symbol: String,
    },
    TokenMinted {
        collection: String,
        recipient: String,
        token_id: String,
        token_uri: String,
    },
}

impl Event {
    fn from_log(log: web3::types::Log) -> Result<Event, Web3Error> {
        match (
            &log.topics.contains(&TOPIC_COLLECTION_CREATED),
            &log.topics.contains(&TOPIC_TOKEN_MINTED),
        ) {
            (true, false) => ethabi::decode(
                &[ParamType::Address, ParamType::String, ParamType::String],
                &log.data.0,
            )
            .map(|params| Event::CollectionCreated {
                collection: params[0].to_string(),
                name: params[1].to_string(),
                symbol: params[2].to_string(),
            })
            .map_err(|_| Web3Error::Internal),
            (false, true) => ethabi::decode(
                &[
                    ParamType::Address,
                    ParamType::Address,
                    ParamType::Uint(256),
                    ParamType::String,
                ],
                &log.data.0,
            )
            .map(|params| Event::TokenMinted {
                collection: params[0].to_string(),
                recipient: params[1].to_string(),
                token_id: params[2].to_string(),
                token_uri: params[3].to_string(),
            })
            .map_err(|_| Web3Error::Internal),
            (_, _) => unreachable!(),
        }
    }
}

#[derive(Default)]
struct AppState {
    events: Events,
}

type SharedState = Arc<RwLock<AppState>>;

async fn event_listener(state: SharedState) -> Result<(), web3::Error> {
    let ws = web3::transports::WebSocket::new("ws://localhost:8545").await?;
    let web3 = web3::Web3::new(ws.clone());
    let mut sub = web3
        .eth_subscribe()
        .subscribe_logs(
            FilterBuilder::default()
                .topics(
                    Some(vec![TOPIC_COLLECTION_CREATED, TOPIC_TOKEN_MINTED]),
                    None,
                    None,
                    None,
                )
                .build(),
        )
        .await?;

    println!("Got subscription id: {:?}", sub.id());

    let state = state.clone();

    (&mut sub)
        .for_each(|maybe_log| {
            println!("Got: {maybe_log:?}");
            if let Ok(log) = maybe_log {
                if let Ok(event) = Event::from_log(log) {
                    state.write().unwrap().events.push(event)
                }
            }
            future::ready(())
        })
        .await;

    Ok(())
}

async fn http_server(state: SharedState) {
    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `GET /events` goes to `events`
        .route("/events", get(events))
        .with_state(state);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "ok"
}

async fn events(State(state): State<SharedState>) -> impl IntoResponse {
    let result = &state.read().unwrap().events;
    Json(json!(result))
}

#[tokio::main]
async fn main() -> web3::Result {
    // initialize tracing
    tracing_subscriber::fmt::init();

    let shared_state = SharedState::default();

    let _ = futures::join!(
        event_listener(shared_state.clone()),
        http_server(shared_state)
    );

    Ok(())
}
