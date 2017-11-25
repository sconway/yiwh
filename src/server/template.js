export default (html) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Yes, I was...</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.green-red.min.css" />
        <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    </head>
    <body>
        <div id="reactRoot">${html}</div>
        <script src="/dist/client.js"></script>
    </body>
    </html>
`;