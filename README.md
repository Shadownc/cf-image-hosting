## 魔改了旧版的`cf-image-hosting`,接入了kv存储新增后台预览、删除功能
## Cloudflare Image Hosting

Free unlimited image hosting on Telegraph, deployed on Cloudflare.

### Features

- Free & Unlimited
- Drag & Drop to upload
- Copy & Paste to upload
- Supported formats: image/video/GIF, Max file size is 5MB

### Screenshots

<img src="https://images.100769.xyz/file/7ebc4b5e4d57c5d315a9f.png" width="700" />

### Development

```
npm install
npm run dev
```

### Deployment

```
npm run deploy
```

### Development Plan

- [x] Redesign UI
- [x] Support compress image
- [x] 图片审查
- [x] 后台查看管理界面

### 开启图片审查
1. 请前往[moderatecontent](https://moderatecontent.com/)注册并获得一个免费的用于审查图像内容的 API key
2. 打开 Cloudflare Workers 和 Pages 的管理页面，找到你发布的cf-image-hosting 依次点击设置，环境变量，添加环境变量
3. 添加一个变量名称为`ModerateContentApiKey`，值为你刚刚第一步获得的`API key`，点击保存即可
**注意：由于所做的更改将在下次部署时生效，你或许还需要进入部署页面，重新部署一下该本项目开启图片审查后，因为审查需要时间，首次的图片加载将会变得缓慢，之后的图片加载由于存在缓存，并不会受到影响**

### 配置登录用户
1. 打开 Cloudflare Workers 和 Pages 的管理页面，找到你发布的cf-image-hosting 依次点击设置，环境变量，添加环境变量
> USERNAME：登录用户名  
PASSWORD：登录密码
2. 更改完进行重新部署
3. 访问域名+/admin就可进入管理界面（未登录会直接跳转到登录页，登录后会自动跳转到admin界面）
<img src="https://images.100769.xyz/file/8e6667617990c5dc7af16.png" width="700" />
<img src="https://images.100769.xyz/file/edac66a9e1631dbd85283.png" width="700" />


### FAQ

<details>
  <summary>How to deploy to Cloudflare?</summary>

```bash
$ git clone https://github.com/Shadownc/cf-image-hosting.git
$ cd cf-image-hosting
$ npm run install && npm run deploy
```

</details>

<details>
  <summary>How to bind a domain name?</summary>
  Triggers -> Custom Domains -> Add a custom domain.
  <img src="https://images.mingming.dev/file/a7e19c9e0f169861fefa6.png" width="700" />
</details>

### License

MIT

### Thanks
[ifyour](https://github.com/ifyour/cf-image-hosting)
[cloudflare](https://dash.cloudflare.com/)