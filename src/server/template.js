import criticalCSS from './criticalCSS.js';

export default (html) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Yes, I was...</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name=”description” content=”Yes I was is a collection of short and funny stories about the things people do, feel, or think while impaired” />
        <meta name="keywords" content="Yes I was,Yes I was high,Yes I was drunk,funny,stories,that,high,drunk,gifs,pictures,HTML,CSS,JavaScript,React,Node,Express">
        <meta name="author" content="Scripted Media">
        <link rel="manifest" href="/manifest.json">
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <style>${criticalCSS}</style>
        <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.green-red.min.css" />
        <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    </head>
    <body>
        <div id="reactRoot">${html}</div>
        <script src="/dist/client.js"></script>
    </body>
    </html>
`;