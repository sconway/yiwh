export const criticalCSS = `
  .spinner {
    position: relative;
    margin: 15px auto;
    width: 100px;
  }
  .spinner:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .spinner__circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .spinner__path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round;
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
  @keyframes color {
    100%, 0% {
      stroke: #d62d20;
    }
    40% {
      stroke: #0057e7;
    }
    66% {
      stroke: #008744;
    }
    80%, 90% {
      stroke: #ffa700;
    }
  }
  footer.footer.mdl-mini-footer {
    align-items: center;
    bottom: 0;
    display: block;
    padding: 16px 0;
    position: fixed;
    width: 100%;
    z-index: 1;
  }
  footer.footer.mdl-mini-footer .email-input {
    left: -9999px;
    opacity: 0;
    position: absolute;
  }
  footer.footer.mdl-mini-footer .icon {
    margin-right: 5px;
  }
  footer.footer.mdl-mini-footer .mdl-logo {
    font-size: 14px;
    margin-bottom: 0;
    margin-right: 25px;
  }
  footer.footer.mdl-mini-footer .footer__contact, footer.footer.mdl-mini-footer .mdl-mini-footer__left-section {
    align-items: center;
    color: #fff;
    display: flex;
    text-decoration: none;
  }
  footer.footer.mdl-mini-footer .mdl-mini-footer__left-section {
    flex: 1;
    justify-content: space-between;
    max-width: 1400px;
    padding: 0 20px;
  }
`;
