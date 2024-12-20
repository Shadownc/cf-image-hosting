## 魔改了旧版的`cf-image-hosting`,接入了kv存储新增后台预览、删除功能
## Cloudflare Image Hosting
## （🈲注意🈲）由于代码修改无法适配 之前的图已经全部删除

Free unlimited image hosting on Telegraph, deployed on Cloudflare.

### Features

- Free & Unlimited
- Drag & Drop to upload
- Copy & Paste to upload
- Supported formats: image/video/GIF, Max file size is 5MB

### Screenshots

<img src="https://images.100769.xyz/file/xT5tyc" width="700" />

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
- [x] 后台图片懒加载

### 开启图片审查
1. 请前往[moderatecontent](https://moderatecontent.com/)注册并获得一个免费的用于审查图像内容的 API key
2. 打开 Cloudflare Workers 和 Pages 的管理页面，找到你发布的cf-image-hosting 依次点击设置，环境变量，添加环境变量
3. 添加一个变量名称为`ModerateContentApiKey`，值为你刚刚第一步获得的`API key`，点击保存即可
**注意：由于所做的更改将在下次部署时生效，你或许还需要进入部署页面，重新部署一下该本项目开启图片审查后，因为审查需要时间，首次的图片加载将会变得缓慢，之后的图片加载由于存在缓存，并不会受到影响**

### 配置登录用户
1. 打开 Cloudflare Workers 和 Pages 的管理页面，找到你发布的cf-image-hosting 依次点击设置，环境变量，添加环境变量
    > USERNAME：登录用户名  
    PASSWORD：登录密码  
    LOGINSSECRET：tokenKey
2. 更改完进行重新部署（或者先添加变量应该也可以）
3. 访问域名+/admin就可进入管理界面（未登录会直接跳转到登录页，登录后会自动跳转到admin界面）
<img src="https://images.100769.xyz/file/tJBM7x" width="700" />
<img src="https://images.100769.xyz/file/kRYBCz" width="700" />
<img src="https://images.100769.xyz/file/f28Shx" width="700" />

**index_bak.tsx中的内容是使用cookie校验登录，本地开发调试建议使用index_bak.tsx中的内容进行，或者请降低hono的版本到3.11.11后开发调试。**  
**目前index.tsx必须部署以后才能正常生成token,本地想要正常使用请降低hono的版本到3.11.11或者在github的Codespaces中进行开发调试（二选一即可）**


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

<details>
  <summary>How to Deploy from Github Action?</summary>
  Before deploying code to Cloudflare via CI, you need a cloudflare token. you can manager from here: <a href="https://dash.cloudflare.com/profile/api-tokens">api-tokens</a>

  If it's a newly created token, select the Edit Cloudflare Workers template, if you have already another token, make sure the token has the corresponding permissions(No, token permissions are not shared between cloudflare page and cloudflare worker).

  then go to your Github repository settings dashboard: Settings->Secrets and variables->Actions->Repository secrets, and add a new secret with the name CLOUDFLARE_API_TOKEN.

  中文翻译：
  如果是新创建的令牌，请选择编辑 Cloudflare Workers模板，如果您已有其他令牌，请确保该令牌具有相应的权限（否，令牌权限不会在 cloudflare 页面和 cloudflare Workers 之间共享）。
  然后转到您的 Github 存储库设置仪表板：Settings->Secrets and variables->Actions->Repository secrets，并添加一个名为 的新密钥CLOUDFLARE_API_TOKEN。
  需要在wrangler.toml添加代码：
  main = "src/index.tsx"
  minify = true
  注意：如果你之前自己发布过Workers,Github Action自动部署会重新生成一个Workers!!!该项目内暂停了Github Action自动部署！！！

</details>

### License

MIT

### Thanks
[ifyour](https://github.com/ifyour/cf-image-hosting)
[cloudflare](https://dash.cloudflare.com/)