sequenceDiagram
    participant user
    participant browser
    participant server
    participant database

    user-->>browser: user navigates to https://studies.cs.helsinki.fi/exampleapp/notes
    browser-->>server : GET https://studies.cs.helsinki.fi/exampleapp/notes
    %%browser requests the note page from the server
    server-->>browser:200 OK (HTML with notes)
    %% server respons with the html contianing the notes

    user->>browser: writes a note in text input field and clicks save button
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    %% browser sending a new note to the server

    activate server
    server-->>database: save new note
    %% server saves new note to database

    database-->>server: confirmation
    server-->>browser: 200 OK updated notes list
    %%server responds with the updated list
    deactivate server

    browser-->>user: update list of notes on the page
    %% browser updates page to show new note on the page
    