sequenceDiagram
    participant user
    participant browser
    participant server
    participant database

    user-->>browser: user navigates to https://studies.cs.helsinki.fi/exampleapp/spa
    browser-->>server: request browser page GET https://studies.cs.helsinki.fi/exampleapp/spa
    %% browser requests the SPA page from the server

    server-->>browser: accepts request status code 200 OK 
    %% server respons with the resources requested
    
    browser-->>user: renders and shows page
    %% browser dynamically renders the SPA for the user