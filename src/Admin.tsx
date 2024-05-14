
export const Admin = () => {
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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.css" integrity="sha512-za6IYQz7tR0pzniM/EAkgjV1gf1kWMlVJHBHavKIvsNoUMKWU99ZHzvL6lIobjiE2yKDAKMDSSmcMAxoiWgoWA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="stylesheet" href="/static/admin.css" />
                <link href="/favicon.ico" rel="icon" />
            </head>

            <body class="admin-body">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4" id="image-container">
                    {/* <div class="group cursor-pointer relative">
                        <img
                            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw1fHxuYXR1cmV8ZW58MHwwfHx8MTY5NDA5OTcyOXww&ixlib=rb-4.0.3&q=80&w=1080"
                            class="w-full h-55 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                        <div class="absolute inset-0 transition duration-200 bg-gray-900 opacity-0 rounded-2xl group-hover:opacity-60"></div>
                        <div class="absolute inset-0 flex flex-col items-center justify-center transition duration-200 opacity-0 group-hover:opacity-100">
                            <div class="mb-2 shadow-sm w-33 rounded-2xl">
                                <a class="inline-flex w-full justify-center items-center px-6 py-2 rounded-2xl shadow-sm border border-transparent text-sm font-medium rounded-2xl text-cool-indigo-700 bg-white transition duration-150 hover:bg-cool-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">查看</a>
                            </div>
                            <div class="mb-2 shadow-sm w-33 rounded-2xl">
                                <a class="w-full justify-center inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white transition duration-150 bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">复制</a>
                            </div>
                            <div class="shadow-sm w-33 rounded-2xl">
                                <a class="w-full justify-center inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white transition duration-150 bg-red-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500">删除</a>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div class="hidden absolute top-5 right-5 w-40 bg-green-100 border-l-4 border-green-500 text-green-700 p-4  rounded-lg" id="calert">
                    <p class="text-lg font-semibold"></p>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.js" integrity="sha512-EC3CQ+2OkM+ZKsM1dbFAB6OGEPKRxi6EDRnZW9ys8LghQRAq6cXPUgXCCujmDrXdodGXX9bqaaCRtwj4h4wgSQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <script src="/static/admin.js"></script>
            </body>
        </html>
    )
}