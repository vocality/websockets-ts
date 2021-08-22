## Features
- Broadcast others connected users when:
    - an user join or quit the app
    - an user clicks on the button 'Get data'
- Use cases: 
    - Real-time notification when an action is occured on DB (crud) in collaboration context
    - Real-time notification when a new Post is cretyed (blog context)
## Under the hood
- Broadcast with:
    - websockets
    - Redis pub/sub on websockets (needs a Redis server)

