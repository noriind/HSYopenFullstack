sequenceDiagram
    participant user
    participant browser
    participant server
    participant database

    user-->>browser: user writes new note
    browser-->>server: POST https://studies.cs.helsinki.fi/exampleapp/spa
    %% browser sends new note to the server trough API call

    activate server
    server-->>database: save the new added note
    %%server saves new note to the db

    database-->>server: confirmation
    server-->>browser: 201 Created (application/json)
    %%server responds with a success msg and 201 status code 
    deactivate server

    browser-->>user: update note list dynamically
    %%browser updates the note list on the page without manual reload.