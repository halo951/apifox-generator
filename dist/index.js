/** apifox-generator
 *
 * @author halo951(https://github.com/halo951)
 * @license MIT
 */
"use strict";var e=require("minimist"),t=require("fs"),i=require("path"),a=require("comment-json"),r=require("chalk"),n=require("fs-extra"),s=require("axios"),o=require("single-line-log"),c=require("enquirer"),l=require("json-schema-to-typescript"),p=require("prettier"),u=require("dayjs"),d=require("array-grouping"),h=require("typescript"),f=require("eslint"),m=require("@typescript-eslint/eslint-plugin"),g=require("@typescript-eslint/parser"),y=require("klona");function w(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function x(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var a=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,a.get?a:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var j=w(e),P=w(t),q=x(t),k=x(i),S=w(i),b=w(r),$=w(n),F=w(s),v=x(l),I=w(p),N=w(u),A=w(h),U=w(g);function D(e,t,i,a){var r,n=arguments.length,s=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(n<3?r(s):n>3?r(t,i,s):r(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}function O(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}Object.create;Object.create;const R={step(e){console.log(b.default.blue("#",e))},message(e){console.log(b.default.green(">",e))},warn(e){console.log(b.default.yellow("!",e))},error(e){console.log(b.default.red("✖",e))},success(e){console.log(b.default.green("√",e))},query(e){console.log(b.default.yellow("?",e))}};class L{str=["█","▇","▆","▅","▄","▃","▂","▁","▂","▃","▄","▅","▇"];suffix="加载中...";duration=120;timer;n=0;show(){this.timer=setInterval((()=>this.render()),this.duration)}destory(){o.stdout(""),clearInterval(this.timer)}render(){const e=this.n%this.str.length,t=`${this.str[e]}  ${this.suffix}`;o.stdout(t),this.n++}}const M=e=>function(t,i,a){const r=a.value;a.value=async function(){const t=new L;t.suffix=e??t.suffix;try{return t.show(),await r.call(this,...arguments)}finally{t.destory()}}},E=e=>function(t,i,a){const r=a.value,{start:n,query:s,success:o,failure:c,exit:l}=e;a.value=async function(){try{s?R.query(s):n&&R.message(n);const e=await r.call(this,...arguments);return o&&R.success(o),e}catch(e){console.error(e),R.error(c??e?.message??"runtime error"),l&&process.exit(0)}}},B=F.default.create({baseURL:"https://api.apifox.cn/",headers:{Origin:"https://www.apifox.cn","X-Client-Mode":"web","X-Client-Version":"2.1.17-alpha.3","X-Device-Id":"xW9HUp7S8CME0TSuW8t5yc5MEyeYw2uHq0R71neRktaketlfC9UQOGcwwOpyED43"},data:{locale:"zh-CN"}});class z{async login(e,t){return await B({method:"POST",url:"/api/v1/login",data:{account:e,password:t}})}async treeList(e,t){return B({url:"/api/v1/api-tree-list",headers:{Authorization:e,"X-Project-Id":t}})}async details(e,t){return B({url:"/api/v1/api-details",headers:{Authorization:e,"X-Project-Id":t}})}async schema(e,t){return B({url:"api/v1/api-schemas",headers:{Authorization:e,"X-Project-Id":t}})}}D([M("登录中..."),O("design:type",Function),O("design:paramtypes",[String,String]),O("design:returntype",Promise)],z.prototype,"login",null),D([M("load list..."),O("design:type",Function),O("design:paramtypes",[String,String]),O("design:returntype",Promise)],z.prototype,"treeList",null),D([M("load details..."),O("design:type",Function),O("design:paramtypes",[String,String]),O("design:returntype",Promise)],z.prototype,"details",null),D([M("load schema..."),O("design:type",Function),O("design:paramtypes",[String,String]),O("design:returntype",Promise)],z.prototype,"schema",null);const C=new z,T=require("enquirer"),{Snippet:_}=require("enquirer"),H=new T;H.use((e=>{e.on("keypress",(()=>{})),e.on("cancel",(()=>process.exit(0)))}));const X=e=>function(){return"submitted"===this?.state?.status?b.default.gray(e):e},G=async e=>{const{input:t,exec:i,max:a,maxErrorMessage:r}=e;let n,s;for(let e=0;e<(a??3);e++)try{return n=await t(),i?(s=await i(n),s):n}catch(t){e+1!==(a??3)&&R.warn(t.message)}throw new Error(r??"失败次数过多, 脚本退出")},W=async e=>await G({input:async()=>{const{merge:t}=await H.prompt({type:"confirm",name:"merge",message:X(`目录 【${e}】存在子目录, 是否合并?`)});return t}});class Y{static configFilePath=["apifox.rule.json"].map((e=>k.join(process.cwd(),e)));configPath;origin;config;constructor(){this.configPath=Y.configFilePath.find((e=>q.existsSync(e)))||void 0}get exist(){return!!Y.configFilePath.find((e=>q.existsSync(e)))}async check(){if(this.exist)return;await(async()=>await G({input:async()=>{const{create:e}=await H.prompt({type:"confirm",name:"create",message:X("缺少配置, 是否创建一个 apifox.rule.json 配置文件"),initial:!0});return e}}))()?this.write():process.exit(0)}read(){if(!this.configPath)return;const e=q.readFileSync(this.configPath,{encoding:"utf-8"});this.origin=a.parse(e),this.config=this.origin??{}}write(){this.configPath||(this.configPath=Y.configFilePath[0]);const e=a.stringify(a.assign(this.config??{},this.origin??{}),null,4);q.writeFileSync(this.configPath,e,{encoding:"utf-8"})}}D([E({query:"check config file is exist"}),O("design:type",Function),O("design:paramtypes",[]),O("design:returntype",Promise)],Y.prototype,"check",null),D([E({success:"read config"}),O("design:type",Function),O("design:paramtypes",[]),O("design:returntype",void 0)],Y.prototype,"read",null),D([E({success:"write to file",failure:"write config failure",exit:!0}),O("design:type",Function),O("design:paramtypes",[]),O("design:returntype",void 0)],Y.prototype,"write",null);const J=c.Prompt,K=e=>(e??[]).length;class Q extends J{value;tree=[];active=0;paging=[];constructor(e){super(e),this.tree=this.origin2tree(e.choices??[],e.initial??[]),this.value=e.initial??[]}origin2tree(e,t){let i=[];for(const a of e){let e=t.find((e=>e.id===a.id)),r={value:{id:a.id,name:a.name},show:!1,checked:!!e,children:[]};a.children?r.children=this.origin2tree(a.children,e?.children??[]):delete r.children,i.push(r)}return i}tree2origin(e){let t=[];for(const i of e)if(i.checked)t.push(i.value);else if(i.children){let e=this.tree2origin(i.children);e.length>0&&(t=t.concat(e))}return t}up(){this.active>0?this.active--:this.active=this.paging.length-1,this.render()}down(){this.active<=this.paging.length-1?this.active++:this.active=0,this.render()}left(){const e=this.paging.find(((e,t)=>t===this.active)),t=e=>{if(e&&(e.show=!1,e.children))for(const i of e.children)t(i)};t(e?.node),this.render()}right(){const e=this.paging.find(((e,t)=>t===this.active));e&&K(e.node.children)>0&&(e.node.show=!0),this.render()}space(){const e=this.paging.find(((e,t)=>t===this.active)),t=(e,i)=>{if(e.checked=i,e.children)for(const a of e.children)t(a,i)},i=e=>{for(const t of e)if(t.children&&t.children.length>0){let e=t.children.some((e=>!e.checked));t.checked=!e,i(t.children)}};e&&t(e.node,!e.node.checked),i(this.tree),this.value=this.tree2origin(this.tree),this.render()}generateList(){const e=["+","-",b.default.blue("→"),"↓"],t=["⬡",b.default.blue("⬢")],i=(a,r=0)=>{for(const n of a){let a=[],s=this.paging.length,o="";a.push(new Array(r).fill("  ").join("")),o=n.show?e[3]:K(n.children)>0?e[0]:s===this.active?e[2]:e[1],a.push(o),a.push(n.checked?t[1]:t[0]),a.push(" "),a.push(n.value.name);let c=a.join(" ");this.paging.push({node:n,str:s===this.active?b.default.bgGray(c):c}),n.show&&K(n.children)>0&&i(n.children??[],r+1)}};return this.paging=[],i(this.tree),this.paging.map((e=>e.str)).join("\n")}async render(){let{size:e}=this.state,t="",i=await this.header(),a=await this.prefix(),r=await this.separator(),n=await this.message();!1!==this.options.promptLine&&(t=[a,n,r,""].join(" "),this.state.prompt=t);let s=await this.error()||await this.hint(),o=await this.generateList(),c=await this.footer();s&&!t.includes(s)&&(t+=" "+s),this.clear(e),this.write([i,t,o,c].filter(Boolean).join("\n")),this.write(this.margin[2]),this.restore()}}class V{config;treeList=[];details=[];schemas=[];async run(e,t){if(this.config=e,t)if("string"==typeof t)for(const e of t.split(","))this.config[e]&&delete this.config[e];else this.config={};this.config.language=await(async e=>void 0!==e?e:await G({input:async()=>{const{language:e}=await H.prompt({type:"select",name:"language",message:X("项目语言"),choices:["ts","js"],initial:"ts"});return e}}))(this.config.language),this.config.outDir=await(async e=>e||await G({input:async()=>{let e;const{outDir:t}=await H.prompt({type:"input",name:"outDir",message:X("设置导出目录"),initial:"./src/apis"}),i=P.default.existsSync(t);return i?R.success("path is existed."):e=(await H.prompt({type:"confirm",name:"create",message:X(`导出目录 [${b.default.blue(t)}] 不存在, 是否创建`),initial:!0})).create,{outDir:t,existed:i,create:e}},exec:async({outDir:e,existed:t,create:i})=>(i?$.default.mkdirsSync(e):t||process.exit(0),e)}))(this.config.outDir),this.config.appendIndexFile=await(async e=>void 0!==e?e:await G({input:async()=>{const{appendIndexFile:e}=await H.prompt({type:"confirm",name:"appendIndexFile",message:X("是否创建公共导出文件 [index.ts]"),initial:!0});return e}}))(this.config.appendIndexFile),this.config.template=await(async e=>{if(0===Object.keys(e??{}).length){const{def:t}=await H.prompt({type:"select",name:"def",message:X("是否使用默认生成模板"),choices:["默认模板","自定义模板"],initial:"默认模板"});if("默认模板"===t)return{header:["/** [group-path] - [group-name]"," *"," * @apifox [apifox-url]"," * @size (启用接口数量) [api-size]个"," * "," * @author apifox-generator"," */"],requestUtil:"request",importSyntax:"import { [requestUtil] } from [utilPath]",utilPath:"@/utils/request",globalRequestParams:{extend:null,keys:[],filter:"unrequire"},globalResponseParams:{extend:null,keys:[],filter:"unrequire"}};e={}}let t;if(!e.header){const{result:t}=await new _({name:"header",message:X("设置文件头样式"),template:["/** {{header:[group-path] - [group-name]}}"," *"," * @apifox {{lib:[apifox-url]}}"," * @size (启用接口数量) [api-size]"," * "," * @author {{author:apifox-generator}}"," */"].join("\n"),header:["**********************************************"," - [group-path] | 当前组的上级文件夹名称 (在存在同名分组时, 可能有些用处)"," - [group-name] | 组名 (apifox 文件夹名称)"," - [file-name]  | 文件名"," - [apifox-url] | 当前项目在apifox上的文件地址"," - [api-size] | | 当前文件夹下生成的接口数量","**********************************************"].join("\n")}).run();e.header=t.split("\n")}if(!e.importSyntax){let{importSyntax:t}=await H.prompt({type:"select",name:"importSyntax",message:X("设置导入语句格式"),choices:["import { [requestUtil] } from [utilPath]","import [requestUtil] from [utilPath]"]});e.importSyntax=t}if(!e.requestUtil){let{requestUtil:i}=await H.prompt({type:"select",name:"requestUtil",message:X("选择请求工具"),header:["*********************************************************************","","request - (推荐) axios.create() 创建的工具实例","axios - axios 默认实例","custom - 自定义请求工具, 需要实现 axios 请求方法","* 注: 由于 fetch api 格式不同, 所以暂时没有实现基于fetch的渲染模板","","*********************************************************************"].join("\n"),choices:["request","axios","custom"]});"custom"===i&&(i=(await H.prompt({type:"input",name:"requestUtil",message:X("输入自定义请求工具名称"),initial:"request"})).requestUtil),e.requestUtil=i,"axios"===i?e.importSyntax="import [requestUtil] from [utilPath]":t=!0}if(t){const{confirm:t}=await H.prompt({type:"confirm",name:"confirm",message:X(`是否使用 [${b.default.blue("@/utils/"+e.requestUtil)}] 作为工具地址`),initial:!0}),{utilPath:i}=await H.prompt({type:"input",name:"utilPath",message:X("请确认请求工具地址"),initial:`@/utils/${e.requestUtil}`,skip:t});e.utilPath=i}if(!e.globalRequestParams){R.step(`配置 ${b.default.magenta("(request params interface)")} 全局参数处理方式`);const{filter:t,keys:i}=await H.prompt([{type:"select",name:"filter",message:X("过滤方式 <filter>"),choices:[{name:"unrequire",message:"unrequire (非必填)"},{name:"delete",message:"delete (删除)"}],initial:"unrequire"},{type:"list",name:"keys",message:"全局变量keys <keys>",initial:[]}]),{extend:a}=await H.prompt({type:"input",name:"extend",message:X("父类 <extend>"),skip:0===i.length,initial:null});e.globalRequestParams={extend:""===a?null:a,filter:t,keys:i.filter((e=>e&&""!==e.trim())).map((e=>e.trim()))}}if(!e.globalResponseParams){R.step(`配置 ${b.default.magenta("(response data interface)")} 全局参数处理方式`);const{filter:t,keys:i}=await H.prompt([{type:"select",name:"filter",message:X("过滤方式 <filter>"),choices:[{name:"unrequire",message:"unrequire (非必填)"},{name:"delete",message:"delete (删除)"}],initial:"unrequire"},{type:"list",name:"keys",message:"全局变量keys <keys>",initial:[]}]),{extend:a}=await H.prompt({type:"input",name:"extend",message:X("父类 <extend>"),skip:0===i.length,initial:null});e.globalResponseParams={extend:""===a?null:a,filter:t,keys:i.filter((e=>e&&""!==e.trim())).map((e=>e.trim()))}}return e})(this.config.template),this.config.token=await(async e=>e||await G({input:async()=>{const{form:e}=await H.prompt({type:"form",name:"form",message:X("launch login..."),choices:[{name:"account",message:"账号/邮箱"},{name:"password",message:"密码"}]});return e},exec:async({account:e,password:t})=>{const i=await C.login(e,t),{data:a,success:r}=i.data;if(!r)throw new Error("登录失败, 请重试");return a.accessToken}}))(this.config.token),this.config.projectId=await(async(e,t)=>t||await G({input:async()=>{const{projectId:e}=await H.prompt({type:"input",name:"projectId",header:b.default.yellow("!","获取方式 (projectId): 通过apifox web端进入项目后, 从url参数中获取"),message:X("projectId")});return e},exec:async t=>{try{return await C.treeList(e,t),t}catch(e){throw new Error(`此项目[projectId: ${b.default.magenta(t)}]不存在, 请确认`)}}}))(this.config.token,this.config.projectId),await this.pullData();const i=this.readApisDirectory(this.treeList);return(this.checkApisIsUpgraded(i,this.config.folders??[])||0==(this.config.usage??[]).length)&&(this.config.folders=i,this.config.usage=await this.multiSelectUsageApis(this.config.folders,this.config.usage??[])),await this.upgradeFileNameMap(),this.config}async pullData(){const e=await C.treeList(this.config.token,this.config.projectId),t=await C.details(this.config.token,this.config.projectId),i=await C.schema(this.config.token,this.config.projectId),{data:a}=e.data,{data:r}=t.data,{data:n}=i.data;this.treeList=a,this.details=r,this.schemas=n,P.default.writeFileSync("./treeList.json",JSON.stringify(a,null,4),{encoding:"utf-8"}),P.default.writeFileSync("./details.json",JSON.stringify(r,null,4),{encoding:"utf-8"}),P.default.writeFileSync("./schemas.json",JSON.stringify(n,null,4),{encoding:"utf-8"})}readApisDirectory(e,t=[]){for(const{key:i,name:a,children:r}of e){const[e,n]=i.split(".");let s={id:n,name:a,children:[]};"apiDetailFolder"===e&&(this.readApisDirectory(r,s.children),t.push(s))}return t}checkApisIsUpgraded(e,t){const i=e=>e.reduce(((e,t)=>{if(e.push(t),t.children){let a=i(t.children);return[...e,...a]}return e}),[]),a=i(e),r=i(t);return a.filter((e=>!r.some((t=>t.id===e.id)))).length>0}async multiSelectUsageApis(e,t){const i=await new Q({message:"选择需要生成的接口集合",choices:e,initial:t,header:["********************************************************************************","生成规则:"," * 以下规则主要应对apifox文件夹出现多层嵌套的情况",""," - 如果一个文件夹下的所有子文件夹被选中, 则接口合并到这个文件夹内"," - 存在一点局限性, 如果一个文件夹下同时存在接口和文件夹时, 将被当作文件夹处理","********************************************************************************"].join("\n")}).run(),a=(e,t)=>{for(const i of e){if(i.id===t.id)return i;if(i.children){const e=a(i.children,t);if(e)return e}}return null};let r=[];const n=async(t,i)=>{for(const s of t){const t=a(e,s);if(t?.children&&t.children.length>0){await W([...i,t.name].join("/"))?r.push({id:s.id,name:s.name}):await n(t.children,[...i,t.name])}else r.push({id:s.id,name:s.name})}};return await n(i,[]),r}async upgradeFileNameMap(){this.config.mapFile||(this.config.mapFile=[]);const e=t=>{let i=[];for(const a of t)i.push(a),a.children&&(i=i.concat(e(a.children)));return i},t=e(this.config.usage).filter((e=>!this.config.mapFile.some((t=>t.id===e.id&&t.file&&""!==t.file?.trim())))),i=await(async e=>0===e.length?[]:await G({input:async()=>{const{form:t}=await H.prompt({type:"form",name:"form",header:"> 注: 输入文件名时, 不需要填写'.ts'文件名后缀",message:X("设置接口映射文件名"),align:"left",choices:e.map((e=>({name:e.id,message:" "+e.name}))),validate(t){let i=[],a=[];for(const r in t){let n=e.find((e=>e.id===r))?.name??"",s=t[r];s&&""!==s.trim()?a.some((e=>e.v===s))&&i.push(`${n} - 命名 '${s}' 存在重复项. repeat: ${a.find((e=>e.v===s))?.lab}`):i.push(`${n} - 未设置文件名`),a.push({lab:n,v:s})}return!(i.length>0)||[b.default.red("\n**************** 错误提示 *****************"),b.default.cyan(i.join("\n")),b.default.red("******************************************")].join("\n")}});return t},exec(t){let i=[];for(const a in t){const r=t[a],n=e.find((e=>e.id===a))?.name??"";i.push({id:a,name:n,file:r})}return i}}))(t);for(const e of i){let t=this.config.mapFile.findIndex((t=>t.id===e.id));-1===t?this.config.mapFile.push(e):this.config.mapFile[t]=e}}}D([E({query:"check and configure generate params",success:"configure completed",failure:"configuration item check not completed, task exit",exit:!0}),O("design:type",Function),O("design:paramtypes",[Object,Object]),O("design:returntype",Promise)],V.prototype,"run",null),D([E({start:"pull project data...",success:"pull completed",exit:!0}),O("design:type",Function),O("design:paramtypes",[]),O("design:returntype",Promise)],V.prototype,"pullData",null),D([E({query:"check api name mapping is filled",success:"adopt",failure:"unknow excaption",exit:!0}),O("design:type",Function),O("design:paramtypes",[]),O("design:returntype",Promise)],V.prototype,"upgradeFileNameMap",null);const Z={printWidth:120,tabWidth:4,useTabs:!1,semi:!1,singleQuote:!0,quoteProps:"as-needed",jsxSingleQuote:!0,trailingComma:"none",bracketSpacing:!0,arrowParens:"always",proseWrap:"preserve",endOfLine:"auto"},ee=(e,t,i)=>{if(e instanceof Array)for(const i of e)ee(i,t,e);else if("object"==typeof e){if("string"==typeof e.title&&(e.description?e.description=e.title+" | "+e.description:e.description=e.title??"[缺少注释]",delete e.title),e.properties&&!i)for(const i in e.properties)if(t.keys.includes(i))if("delete"===t.filter)delete e.properties[i];else{e.required=e.required.filter((e=>e!==i));let t=e.properties[i];t.title?t.title="(全局变量) "+t.title??"":t.description="(全局变量) "+t.description??""}for(const i in e){const a=e[i];ee(a,t,e)}}},te=(e,t)=>{e&&t&&""!==t.trim()&&(e.extends={title:t,type:"any"})},ie=e=>e.replace(/[\_\-](\w)/g,((e,t)=>t.toUpperCase())),ae=(e,t)=>`I${e=(e=ie(e)).replace(/^([\w])/,((e,t)=>t.toUpperCase()))}${t}`,re=(e,t)=>(t[e]?t[e]++:t[e]=1,e+=1===t[e]?"":t[e]-1);class ne{config;details;js;linter=new f.Linter;constructor(){this.linter.defineParser("@typescript-eslint/parser",U.default),this.linter.defineRules(m.rules)}async exec(e){const{config:t,details:i,treeList:a,schemas:r}=e;this.config=t,this.details=i,this.js="js"===t.language;const{outDir:n,usage:s}=t,o=[];this.details=((e=[])=>e.filter((e=>"deprecated"!==e.status)))(i),((e=[],t=[])=>{const i=e=>{if(e instanceof Array)for(const t of e)i(t);else if("object"==typeof e){if(e&&e.$ref){const[,,i]=e.$ref.split("/");delete e.$ref;const a=t.find((({id:e})=>e.toString()===i));a&&(Object.assign(e,y.klona(a.jsonSchema)),delete e.$ref)}for(const t in e)i(e[t])}};i(t),i(e)})(i,r);for(const{id:e,name:i}of s){const r=t.mapFile.find((t=>t.id===e))?.file??"undefined",n=this.findApisByFolder(a,e);this.checkDuplicatePath(n);const s=this.extractBaseUrlByApis(n),c={},l=[];for(const e of n){const t=await this.transformApiInfo(e,c,s);l.push(t)}const p=this.findGroupPath(e,a),u=this.generateHeader(r,i,p,l.length),d=this.generateContext(i,l);o.push({moduleName:k.basename(r),comment:i,mapFile:r,header:u,context:d})}for(const e of o)await this.outputFile(n,e.mapFile,e.header,e.context);this.config.appendIndexFile&&this.outputFile(n,"index.ts",this.generateIndexFile(o),"")}findApisByFolder(e,t){let i=[];const a=e=>{for(const i of e){const[e,r]=i.key.split(".");if(`${r}`==`${t}`)return i.children;if("apiDetailFolder"===e){let e=a(i.children);if(e)return e}}return null},r=e=>{let t=[];for(const i of e){const{type:e}=i;if("apiDetailFolder"===e){let e=r(i.children);t=t.concat(e)}else"apiDetail"===e&&t.push(i)}return t};return i=(e=>e.map((e=>{const[,t]=e.key.split(".");return this.details.find((e=>e.id==t))})))(r(a(e)??[])).filter((e=>e)),i}findGroupPath(e,t){const i=t=>{for(const a of t){if(a.children){let e=i(a.children);if(e.length>0)return e.push(a),e}if(a.api?.id===e)return[a]}return[]},a=i(t);return a.pop(),0===a.length?"*":a.map((e=>e.name)).join(" - ")}extractBaseUrlByApis(e){const t=e.map((e=>e.path)).map((e=>e.split("/")));let i=t.reduce(((e,t)=>e<t.length?e:t.length),t[0].length),a=[];for(let e=0;e<i;e++){const i=t.map((t=>t[e]));if(new Set(i).size>1)break;a.push(i[0])}return a.join("/")}checkDuplicatePath(e){const t=d.GroupBy(e,((e,t)=>e.path===t.path)).reduce(((e,t)=>(t.length>1&&e.push(`> 存在相同接口定义: ${t[0].path}`),e)),[]);if(t.length>0){t.unshift("\n*************************************\n"),t.push("\n\n\n");for(const e of t)R.error(e);process.exit(-1)}}async transformApiInfo(e,t,i){const{id:a,method:r,path:n,name:s,createdAt:o,updatedAt:c}=e,{globalRequestParams:l,globalResponseParams:p}=this.config.template,u=this.generateBaseName(n,t,i),d=this.generateParamsInterfaceName(u,t),h=this.generateParamsInterfaceName(u+"Path",t),f=this.generateResponseInterfaceName(u);ee(e.requestBody.jsonSchema,l),te(e.requestBody.jsonSchema,l.extend);const m={bannerComment:"",unreachableDefinitions:!0,declareExternallyReferenced:!1,ignoreMinAndMaxItems:!0,additionalProperties:!1,unknownAny:!1};let g=null;if(Object.keys(e.requestBody?.jsonSchema?.properties||{}).length>0)try{g=await v.compile(e.requestBody.jsonSchema,d,m)}catch(e){R.error("json2ts parser error: "+d),g=`export interface ${d} { [key:string|number]: any }`}const y=[],w=[];for(const i of e.responses){ee(i.jsonSchema,p),te(i.jsonSchema,p.extend);const e=re(f,t);let a;try{a=await v.compile(i.jsonSchema,e,m)}catch(t){R.error("json2ts parser error: "+e),a=`export interface ${e} { [key:string|number]: any }`}y.push(e),w.push(a)}let x=null;if(e?.parameters?.path?.length)try{const t=(e=>{e instanceof Array||(e=[e]);const t={type:"object",properties:{},required:[]};for(const i of e)t.properties[i.name]={type:i.type??"string",required:!0,description:i.description},t.required.push(i.name);return t})(e.parameters.path);x=await v.compile(t,h,m)}catch(e){R.error("json2ts parser error: "+h)}return{id:a,method:r,path:n,name:s,basename:u,createdAt:o,updatedAt:c,hasParams:!!g,params:g,paramsName:d,responses:w,responseNames:y,hasPathParams:!!x,pathParamsName:h,pathParams:x}}generateBaseName(e,t,i){return[e=>e.replace(i,""),e=>e.replace(/[\$]{0,1}\{.+?\}/g,""),e=>e.replace(/^[\/]+/g,""),e=>e.replace(/[\/]+/g,"_"),e=>ie(e),e=>re(e,t),e=>(e=>{if(/A-Z/.test(e))return e;try{const t="export const function = (params: any) : any => {}";return A.default.transpile(t,{strict:!0,declaration:!0,target:2}),e}catch(t){return console.log(t),ie("q_"+e)}})(e)].reduce(((e,t)=>t(e)),e)}generateParamsInterfaceName(e,t){return re(ae(e,"Params"),t)}generateResponseInterfaceName(e){return ae(e,"Response")}generateHeader(e,t,i,a){const{header:r,importSyntax:n,requestUtil:s,utilPath:o,globalRequestParams:c,globalResponseParams:l}=this.config.template;let p="",u=n.replace("[requestUtil]",s).replace("{ axios }","axios").replace("[utilPath]",`"${"axios"===s?"axios":o}"`).replace(/["']{2}/g,'"');if(c.extend||l.extend){let e=[c.extend,l.extend].filter((e=>e)).join(", ");u=!/\{/.test(u)?u.replace(s,`${s}, { ${e} } `):u.replace(s,`${s}, ${e}`)}return p+=u,p+="\n",p+="\n",p+=r instanceof Array?r.join("\n"):r,p+="\n",p=p.replace(/\[group-path\]/g,i).replace(/\[group-name\]/g,t).replace(/\[file-name\]/g,e).replace(/\[apifox-url\]/g,`https://www.apifox.cn/web/project/${this.config.projectId}`).replace(/\[api-size\]/g,a.toString()),p+="\n\n",p}generateContext(e,t){const{requestUtil:i}=this.config.template;let a="";for(const r of t){r.hasParams&&(a+=`/** params interface | ${r.name} */`,a+="\n",a+=r.params,a+="\n"),r.hasPathParams&&(a+=`/** path params interface | ${r.name} */`,a+="\n",a+=r.pathParams,a+="\n"),a+=`/** response interface | ${r.name} */`,a+="\n",a+=r.responses.join("\n"),a+="\n";const t=r.hasParams?", params":"";let n;r.hasPathParams?(n=r.path.replace(/[\$]{0,1}\{(.+?)\}/g,"${params.$1}"),n="`"+n+"`"):n=`'${r.path}'`;let s=`\n                /** ${e} - ${r.name}\n                 * \n                 * [params comment]\n                 * @updateAt ${N.default(r.updatedAt).format("YYYY-MM-DD HH:mm")}\n                 */\n                export const ${r.basename} = async ([params]) [response name] => {\n                    return ${i}.${r.method.toLowerCase()}(${n}${t})\n                }\n            `;if(s=s.replace(/\[api url\]/,r.path),r.hasParams||r.hasPathParams){const e=[r.hasParams?r.paramsName:null,r.hasPathParams?r.pathParamsName:null].filter((e=>e)).join("&"),t=!(r.hasPathParams||r.params&&/[\w]+:/gm.test(r.params));s=s.replace(/\[params comment\]/,`@param {${e}} params`),s=s.replace(/\[params\]/,`params${t?"?":""}: ${e}`)}else s=s.replace(/\[params comment\]/,""),s=s.replace(/\[params\]/,"");s=r.responseNames.length>0?s.replace(/\[response name\]/,": Promise<"+r.responseNames.join(" | ")+">"):s.replace(/\[response name\]/,""),a+=s,a+="\n\n"}return a=a.replace(/\/\*\*\n.+?\* (.*)\n.*\*\//g,((e,t)=>`/** ${t} */`)),a=a.replace(/NoName/g,"any // 注: 工具协议版本低, 未识别对象类型"),a}generateIndexFile(e){const t=e.map((e=>`import * as ${ie(e.moduleName)} from './${e.moduleName}'`)),i=e.map((e=>[`/** ${e.comment} */`,ie(e.moduleName)].join("\n")));return`\n        ${t.join("\n")}\n        \n        /** apis 接口集合 */\n        export const apis = {\n            ${i.join(",\n")}\n        }\n        `.trim()}async outputFile(e,t,i,a){const r=await(async()=>{const e=S.default.join(__dirname,"prettier.config.js");let t;var i;return P.default.existsSync(e)&&(t=await(i=e,Promise.resolve().then((function(){return x(require(i))})))),{...Z,...t}})(),s=e=>{try{return I.default.format(e,{parser:"typescript",...r})}catch(t){return e}};n.mkdirsSync(e);let o=i+"\n"+a,c=k.join(e,t);c=c.replace(k.extname(c),"");try{o=this.linter.verifyAndFix(o,{parser:"@typescript-eslint/parser",rules:{"array-type":[2,{default:"generic"}]}}).output}catch(e){R.error("typescript parser failure. please check: "+b.default.magenta(t))}if(this.js){const e=A.default.getTransformers({target:A.default.ScriptTarget.ESNext,module:A.default.ModuleKind.ESNext,declaration:!0});let t=A.default.transpile(o,{strict:!1,target:h.ScriptTarget.ESNext,module:h.ModuleKind.ESNext,declaration:!0}),i=A.default.transpileModule(o,{compilerOptions:{target:A.default.ScriptTarget.ESNext,module:A.default.ModuleKind.ESNext,declaration:!0},transformers:{before:e.declarationTransformers}}).outputText;q.writeFileSync(c+".js",s(t),{encoding:"utf-8"}),q.writeFileSync(c+".d.ts",s(i),{encoding:"utf-8"})}else q.writeFileSync(c+".ts",s(o),{encoding:"utf-8"})}}D([E({start:"start generate",success:"success",exit:!0}),M("generate..."),O("design:type",Function),O("design:paramtypes",[V]),O("design:returntype",Promise)],ne.prototype,"exec",null);module.exports=class{loader=new Y;configure=new V;generator=new ne;async exec(){const{reset:e,init:t}=j.default(process.argv);if(t)return this.init();await this.loader.check(),await this.loader.read(),await this.configure.run(this.loader.config,e),await this.loader.write(),await this.generator.exec(this.configure)}async init(){await this.configure.run(this.loader.config,!0),await this.loader.write()}};
