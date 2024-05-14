export function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>IMyself Images Service</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.5.3/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/static/style.css" />
        <link href="/favicon.ico" rel="icon" />
      </head>

      <body>
        <div className="full-window" ondragover="event.preventDefault()">
          <div className="container card">
            <h3 className="text-center">IMyself Images Service</h3>
            <p className="text-center text-muted">
              联系QQ:365172043
            </p>
            <button
              id="upload"
              className="btn btn-primary mx-auto"
              type="button"
              title="Supported formats: Images, videos, GIFs"
            >
              <span className="spinner-grow spinner-grow-sm d-none"></span>
              <span className="upload-text">
                拖拽或直接截图并粘贴或点击上传
              </span>
              <input
                id="fileInput"
                type="file"
                name="file"
                accept="image/*, video/*"
              />
            </button>
            <div
              id="uploadStatus"
              className="text-center"
              style="margin-top: 10px"
            ></div>
            <a
              className="text-center text-muted github"
              href="https://github.com/Shadownc/cf-image-hosting"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
        <div class="alert alert-danger alert-dismissible fade show u-error-alert" role="alert">
          <span id="u-error-text"></span>
          <button type="button" id="u-error-close" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/browser-image-compression/2.0.2/browser-image-compression.min.js"></script>
        <script src="/static/script.js"></script>
      </body>
    </html>
  );
}
