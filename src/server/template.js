import criticalCSS from './criticalCSS.js';

export default (html) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Yes, I was... | A collection of funny stories</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="description" content="Yes I was Drunk and Yes I Was High are collections of short and funny stories or images about the things people do, feel, or think while impaired" />        <meta name="keywords" content="Yes I was,Yes I was high,Yes I was drunk,funny,stories,that,high,drunk,gifs,pictures,HTML,CSS,JavaScript,React,Node,Express">
        <meta name="author" content="Scripted Media">
        <link rel="manifest" href="/manifest.json">
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <style>${criticalCSS}</style>
        <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.green-red.min.css" />
        <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    </head>
    <body>
        <div style="position: absolute !important;height: 1px;width: 1px;overflow: hidden;clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);" >
            <p>
                The latest funny stories from people under the influence. Got a funny story? Share it here, at "Yes, I was"!
            </p>
            <h2>
            JUST WATCHED TV FOR A GOOD 5 MINUTES BEFORE I REALIZED IT WAS JUST THE INTRO SCREEN.
            — YES, I WAS HIGH
            </h2>
            <h2>
            TRIED TO SIGN INTO MY BUILDING WITH MY DEBIT CARD...
            — YES, I WAS DRUNK
            </h2>
            <h2>
            CRIED AFTER REALIZING BED LOOKED LIKE A BED
            — YES, I WAS HIGH
            </h2>
            <h2>
            THE FIRST TIME I TOOK SHROOMS WAS BEFORE I WAS GOING TO A PARTY AT A FRIENDS HOUSE. I WAS TOLD THEY WOULD TAKE ABOUT 2
            HOURS TO KICK IN, SO I TRIED TO TIME IT BEFORE THE PARTY STARTED. ONE EMPTY STOMACH AND AN HOUR LATER, I WAS HITTING
            EVERY TRASH CAN IN THE STREET WITH MY CAR, THINKING I WAS A REAL LIFE MARIO CART PLAYER...
            -YES, I WAS HIGH
            </h2>
        </div>

        <div id="reactRoot">${html}</div>
        
        <script src="/dist/client.js"></script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-113949202-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-113949202-1');
        </script>
    </body>
    </html>
`;