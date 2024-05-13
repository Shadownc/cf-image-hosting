
export const Login = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>IMself Images Admin</title>
        <link href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/tailwindcss/2.2.19/tailwind.min.css" type="text/css" rel="stylesheet" />
        <link href="/favicon.ico" rel="icon" />
      </head>

      <body>
        <div class="bg-gradient-to-br from-purple-700 to-pink-500 min-h-screen flex flex-col justify-center items-center">
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h1 class="text-4xl font-bold text-center text-purple-700 mb-8">IMyself Images Service</h1>
            <form class="space-y-6">
              <div>
                <label class="block text-gray-700 font-bold mb-2" for="email">
                  用户名
                </label>
                <input class="w-full px-4 py-2 rounded-lg border border-gray-400" id="email" name="email"
                  type="email" />
              </div>
              <div>
                <label class="block text-gray-700 font-bold mb-2" for="password">
                  密码
                </label>
                <input class="w-full px-4 py-2 rounded-lg border border-gray-400" id="password" name="password"
                  type="password" />
              </div>
              <div>
                <button class="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg">
                  登录
                </button>
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  )
}