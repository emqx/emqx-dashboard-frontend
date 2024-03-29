import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export default {
  ...zhLocale,
  // 全局
  select: {
    cluster: '全部节点',
    placeholder: '请选择',
  },
  error: {
    networkError: '网络错误',
    initializationError: '初始化错误',
    module_not_loaded: '相关模块未打开',
  },
  // success
  success: {
    createSuccess: '创建成功',
  },
  // oper
  oper: {
    confirmDelete: '确认删除该项?',
    confirmStop: '确认停止?',
    confirm: '确认',
    cancel: '取消',
    delete: '删除',
    oper: '操作',
    edit: '编辑',
    save: '保存',
    create: '创建',
    view: '查看',
    viewMore: '查看更多',
    expand: '展开',
    collapse: '收起',
    refresh: '刷新',
    add: '添加',
    addSuccess: '添加成功',
    editSuccess: '编辑成功',
    startSuccess: '启动成功',
    stopSuccess: '停止成功',
    enableSuccess: '启用成功',
    disabledSuccess: '停用成功',
    deleteSuccess: '删除成功',
    disconnectSuccess: '断开连接成功',
    clear: '清空成功',
    from: '从',
    stop: '停止',
    start: '启动',
    notice: '注意',
    learnMore: '了解更多',
    confirmDisconnect: '确认断开连接？',
    confirmKickOut: '确认踢除客户端？',
    confirmCleanSession: '确认清除会话？',
    yes: '是',
    no: '否',
    online: '在线',
    offline: '离线',
    warning: '警告',
    subscribe: '订阅',
    unsubscribe: '取消订阅',
    unsubscribeConfirm: '此操作将取消订阅该主题',
    pleaseEnter: '请输入',
    copy: '复制',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    generate: '生成',
    search: '搜索',
    reset: '重置',
    next: '下一页',
    prev: '上一页',
    fileTip: '请上传文件',
    uploadFailed: '上传失败',
  },
  // topbar
  topbar: {
    tryEnterprise: '试用企业版',
  },
  // leftbar
  leftbar: {
    // MONITORING
    monitor: '监控',
    overview: '控制台',
    clients: '客户端',
    connections: '连接',
    sessions: '会话',
    topics: '主题',
    subscriptions: '订阅',
    // RULES
    rule_engine: '规则',
    // MANAGEMENT
    management: '管理',
    plugins: '插件',
    modules: '模块',
    listeners: '监听器',
    instances: '服务',
    // TOOLS
    tools: '工具',
    websocket: 'Websocket',
    api: 'HTTP接口',
    // APPLICATIONS
    applications: '应用',
    // ADMIN
    admin: '系统',
    users: '用户',
    settings: '设置',
    help: '帮助',
    general: '通用',
    // Analysis
    analysis: '统计分析',
    topicMetrics: '主题监控',
    alarms: '告警',
  },
  // overview
  overview: {
    // Broker
    broker: '系统信息',
    systemName: '名称',
    version: '版本',
    uptime: '运行时间',
    systemTime: '系统时间',
    // Nodes
    nodes: '节点信息',
    name: '节点名称',
    erlangOTPRelease: 'Erlang/OTP 版本',
    erlangProcesses: 'Erlang 进程',
    cpuInfo: 'CPU',
    memoryInfo: '内存',
    maxFds: '最大文件句柄数',
    status: '状态',
    // Stats
    stats: '运行统计',
    topicsCount: '主题数',
    topicsMax: '峰值',
    connectionsCount: '连接数',
    connectionsMax: '峰值',
    retainedCount: '保留消息数',
    retainedMax: '最大保留消息数',
    sessionsCount: '会话数',
    sessionsMax: '峰值',
    subscribersCount: '订阅数',
    subscribersMax: '峰值',
    subscriptionsCount: '订阅数',
    subscriptionsMax: '峰值',
    subscriptionsSharedCount: '共享订阅数',
    subscriptionsSharedMax: '峰值',
    // Metrics
    metrics: '度量指标',
    packetsData: 'MQTT 报文',
    messagesData: '消息',
    bytesData: '流量收发(字节)',
    session: '会话',
    client: '客户端',
    delivery: 'Delivery',
  },
  // Clients
  clients: {
    node: '节点',
    nodeName: '节点名称',
    clientId: '客户端 ID',
    username: '用户名',
    ipAddr: 'IP 地址',
    port: '端口',
    cleanStart: '清除会话',
    keepalive: '心跳（秒）',
    back: '返回',
    subscriptionsCount: '当前订阅数量',
    expiryInterval: '会话过期间隔（秒）',
    maxInflight: '最大拥塞',
    inflightLen: '当前拥塞',
    mqueueLen: '当前缓存消息',
    mqueueDropped: '丢弃消息',
    awaitingRelLen: '等待释放',
    deliverMsg: '投递消息',
    enqueueMsg: '入队消息',
    createdAt: '会话创建时间',
    connectedAt: '连接时间',
    connected: '连接状态',
    clientsDetails: '详情',
    basicInfo: '基础信息',
    subsInfo: '订阅列表',
    protoVer: '协议版本',
    protoName: '协议名称',
    protoType: '协议类型',
    connectInfo: '连接信息',
    isBridge: '是否为桥接',
    disconnectAt: '断开连接时间',
    session: '会话信息',
    max: '最大',
    subscriptions: '订阅数量',
    inflight: '飞行窗口',
    mqueue: '消息队列',
    awaiting_rel: '未确认的 PUBREC 数据包计数',
    recv_cnt_desc: '接收的 TCP 报文数量',
    recv_msg_desc: '接收的 PUBLISH 报文数量',
    recv_oct_desc: '接收的字节数量',
    recv_pkt_desc: '接收的 MQTT 报文数量',
    send_cnt_desc: '发送的 TCP 报文数量',
    send_msg_desc: '发送的 PUBLISH 报文数量',
    send_oct_desc: '发送的字节数量',
    send_pkt_desc: '发送的 MQTT 报文数量',
    currentSubs: '当前订阅数',
    addSubs: '添加订阅',
    view: '详情',
    disconnected: '已断开',
    kickOut: '踢除',
  },
  // topics
  topics: {
    topic: '主题',
    node: '节点',
  },
  // subscriptions
  subscriptions: {
    clientId: '客户端 ID',
    topic: '主题',
    qoS: 'QoS',
    share: '共享订阅',
  },
  // plugins
  plugins: {
    name: '插件名称',
    version: '版本',
    description: '描述',
    status: '状态',
    stopped: '已停止',
    running: '运行中',
    start: '启动',
    stop: '停止',
    config: '配置',
    manage: '管理',
    tutorial: '使用文档',
    back: '返回',
    advancedConfig: '高级配置',
    add: '新增',
    configSuccess: '配置成功',
    configFailure: '配置失败',
    notice: '你确定提交这些配置吗？重启插件后生效',
    giveUpNotice: '你确定放弃应用已更改的配置吗？',
    noticeTitle: '注意',
    cacheNotice: '已放弃操作',
    emptyConfigOption: '默认配置项为空',
    searchByName: '按插件名称搜索',
    usernameRequired: '请填写 username',
    passwordRequired: '请填写 password',
    clientidRequired: '请填写 Client ID',
    algorithm: '加密算法',
    secret: '密钥或私钥',
    payloadDesc: '启用 verify_claims 时有效, 可以使用 %u，%c 占位符分别替换输入的 username 和 clientid，详见',
    jwtDoc: 'JWT 认证',
    dataDesc: '一行一组数据，使用逗号分割 username,clientid',
    secretRequired: '请输入 Secret',
    payloadRequired: '请输入 Payload 模版',
    dataRequired: '请填写 Payload 数据',
    leaveTokenPage: '离开页面后当前输入的配置与生成的 TOKEN 信息均不再保留，确认离开？',
  },
  modules: {
    name: '模块名称',
    enable: '启用',
    disable: '停用',
    enabled: '已启用',
    disabled: '已停用',
  },
  // instances
  instances: {
    instances: '服务',
    back: '返回',
    info: '基本信息',
    name: '实例名称',
    descr: '备注信息',
    service: '所属服务',
    configInfo: '配置信息',
    initConfig: '初始化配置或',
    remarkConfig: '请输入备注信息',
    createInstance: '新建服务',
    selectServiceType: '选择实例类型',
    all: '全部',
    running: '运行中',
    stopped: '已停止',
    auth: '认证',
    backend: '持久化',
    hook: '回调钩子',
    bridge: '数据桥接',
    other: '其他',
    select: '选择',
    selected: '已选择',
    nextStep: '下一步',
    authDesc: '提供登录认证与发布订阅 ACL 服务。',
    backendDesc: '提供消息持久化到数据库服务。',
    bridgeDesc: '提供将消息流桥接为消息中间件数据源服务。',
    hookDesc: '使用触发回调机制响应操作的服务。',
    otherDesc: '系统运行信息等其他服务。',
  },
  // listeners
  listeners: {
    protocol: '协议',
    listenOn: '监听地址',
    maxConnections: '最大连接数',
    currentConnections: '当前连接数',
  },
  // websocket
  websocket: {
    // Connect
    connect: '连接',
    host: '主机地址',
    port: '端口',
    clientID: '客户端 ID',
    username: '用户名',
    password: '密码',
    keepAlive: '心跳（秒）',
    cleanSession: '清除会话',
    disconnect: '断开连接',
    currentState: '当前状态',
    // Subscribe
    subscribe: '订阅',
    topic: '主题',
    qoS: '服务质量',
    date: '订阅时间',
    oper: '操作',
    // Messages
    messages: '消息',
    retained: '保留',
    send: '发送',
    messagesAlreadySent: '发布消息列表',
    messagesReceived: '订阅消息列表',
    time: '时间',
    connectError: '消息发送错误',
    connectFailure: '连接失败',
    connectLeave: '尚未连接到服务器',
    subscribeSuccess: '订阅成功',
    subscribeFailure: '订阅失败',
    messageSendOut: '消息已发出',
    connected: '已连接',
    connecting: '正在连接',
    disconnected: '未连接',
    notSupport: '你的浏览器暂不支持WebSocket',
  },
  // http_api
  httpApi: {
    introduction: '说明',
    desc:
      '除了帮助页面，所有URI返回application/json格式的的资源，每个请求都需要HTTP基本认证。默认用户是admin / public。<br/>' +
      'emqx_dashboard插件提供了一个Web管理控制台, 用于监控服务器的运行状态，数据统计和MQTT包计数监控。',
    reference: '参考',
    method: '请求方法',
    path: '路径',
    description: '描述',
    back: '返回',
    linkAddress: '请求地址',
    data: '响应数据',
  },
  // applications
  app: {
    appId: 'AppID',
    secret: 'App密钥',
    newApp: '新建APP',
    viewApp: '查看App',
    editApp: ' 编辑App',
    errors: '该项为必填项',
    name: 'App名称',
    desc: '备注',
    expired: '到期日期',
    status: '状态',
    enable: '允许访问',
    disable: '拒绝访问',
    enableText: '允许访问',
    disableText: '拒绝访问',
    expiredText: '永不过期',
    guide: '应用用于 EMQX 管理监控 API (REST API) 连接认证，详见',
    docs: '文档',
  },
  // users
  users: {
    newUser: '新建用户',
    editUser: '编辑用户',
    username: '用户名',
    remark: '备注',
    password: '密码',
    confirmPassword: '确认密码',
    oldPassword: '旧密码',
    newPassword: '新密码',
    confirmNewPassword: '确认新密码',
    changePassword: '修改密码',
    dontChangePassword: '不修改密码',
    usernameRequired: '请填写用户名',
    remarkRequired: '请填写备注',
    usernameIllegal: '用户名长度: 3~32',
    passwordRequired: '请填写密码',
    newPasswordRequired: '请填写新密码',
    passwordInconsistent: '密码不一致',
    authenticate: '你已成功修改已登录用户密码，请重新登录',
    createUser: '新建用户成功',
    passwordIllegal: '密码长度: 3~255',
  },
  // alert
  alert: {
    required: '字段是必填项',
    success: '成功',
    failure: '失败',
    connect: '连接',
  },
  // login
  login: {
    title: '登 录',
    username: '用户名',
    password: '密码',
    remember: '记住',
    loginButton: '登 录',
    error: '用户名或密码错误',
    usernameRequired: '请填写用户名',
    passwordRequired: '请填写密码',
  },
  // settings
  settings: {
    themes: '样式主题',
    language: '系统语言',
    apply: '应 用',
    success: '修改成功',
  },
  // importConfig
  config: {
    importConfig: '导入配置',
    selectConfigFile: '选择配置文件',
    configFileMustBeJson: '请确保备份文件为正常 JSON 格式',
    createBy: '由',
    create: '创建',
    createUser: '创建用户',
    nodeName: '节点名称',
    host: '主机地址',
    descr: '备注信息',
    createAt: '创建时间',
    more: '更多信息',
    reSelect: '重新选择',
    not_a_valid_config_file: '不是合法的配置文件',
    payload_error: '无效的内容',
    import_file_error: '导入文件出错',
    exportConfig: '导出配置',
    ex: '导出',
    atLeastThree: '至少3个字符',
    importSuccess: '导入成功',
    notice:
      '使用备份的配置文件进行配置初始化/修改。<br/>注意: 配置文件可能包含有重要数据如数据库地址与认证信息，请妥善保管配置文件并合理使用备份功能。',
  },
  help: {
    quickStart: '快速开始',
    emqxDesc:
      'EMQX 基于 Erlang/OTP 平台开发的 MQTT 消息服务器，是开源社区中最流行的 MQTT 消息服务器，支持丰富的物联网协议，包括 MQTT、LwM2M、MQTT-SN、CoAP、 LoRaWAN、 HTTP 和 WebSocket 等。欢迎 follow 我们的项目或参与构建。',
    emqxEnterprise: 'EMQX 企业版',
    enterpriseDesc:
      'EMQX 企业版内置了各种数据持久化支持、安全审计、运行监控等功能，为您提供功能更全面、稳定性与性能更强、数据安全与服务响应级别更高的服务。<br/>最新企业版包含全新的 Dashboard，让您可以轻松创建并管理数十个节点、数百万连接的 IoT Hub 集群。',
    freeTrial: '免费试用',
    useDocs: '使用文档',
    docsDesc: '我们为您准备了齐全的使用文档，帮助您熟悉更多强大的功能。',
    forwardView: '前往查看',
    faqDesc: 'FAQ 收录了所有可能出现的问题，优先推荐使用 FAQ 检索您使用过程中遇到的问题。',
    forwardFaq: '前往 FAQ',
    followUs: '关注我们',
    ytLink: 'https://www.youtube.com/channel/UCir_r04HIsLjf2qqyZ4A8Cg',
  },
  analysis: {
    topicMetrics: '主题监控',
    metricsTip: '（数据统计为实时刷新数据，包含自添加以来全部统计数据）',
    messageIn: '消息流入',
    messageOut: '消息流出',
    messageDrop: '消息丢弃',
    addTopic: '添加主题',
    details: '详情数据',
    all: '全部',
    rateItem: '{0} 条/秒',
    rate: '（速率）',
    messageInDesc: '（消息流入速率）',
    messageOutDesc: '（消息流出速率）',
    messageDropDesc: '（消息丢弃速率）',
    loadAnalysis: '启用',
    loadSuccess: '启用成功',
    alarmName: '告警名称',
    alarmMessage: '告警消息',
    activateAt: '开始时间',
    deactivateAt: '结束时间',
    duration: '持续时间',
    durationTips: '日：时：分：秒',
    currentAlarms: '当前告警',
    historicalAlarm: '历史告警',
    deactivate: '取消告警',
    clearAll: '清除全部',
    confirmClear: '确认清除全部告警信息？',
    confirmDeactivate: '确认取消该告警信息？',
  },
  httpCode: {
    0: '成功',
    101: 'RPC 操作失败',
    102: '未知错误',
    103: '用户名或密码错误',
    104: '空的用户名密码',
    105: '用户不存在',
    106: '不能删除管理员',
    107: '请求参数错误',
    108: '请求参数类型错误',
    109: '请求体不是 JSON',
    110: '插件当前已经启动',
    111: '插件当前已经停止',
    112: '客户端不在线',
    113: '用户已存在',
    114: '旧密码错误',
    115: '主题错误',
  },
  util: {
    day: '天',
    year: '年',
  },
}
