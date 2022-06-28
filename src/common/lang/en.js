import enLocale from 'element-ui/lib/locale/lang/en'

export default {
  ...enLocale,
  // globe
  select: {
    cluster: 'All Nodes',
    placeholder: 'Select Node',
  },
  // error
  error: {
    networkError: 'Network Error',
    initializationError: 'Initialization Error',
    module_not_loaded: 'Related module are not load',
  },
  // success
  success: {
    createSuccess: 'Create Success',
  },
  // oper
  oper: {
    confirmDelete: 'Confirm Delete ?',
    confirmStop: 'Confirm Stop?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    oper: 'Operation',
    edit: 'Edit',
    save: 'Save',
    create: 'Create',
    view: 'View',
    viewMore: 'View More',
    expand: 'Expand',
    collapse: 'Collapse',
    refresh: 'Refresh',
    add: 'Add',
    addSuccess: 'Add Success',
    editSuccess: 'Edit success',
    startSuccess: 'Start Success',
    stopSuccess: 'Stop Success',
    enableSuccess: 'Enable Success',
    disabledSuccess: 'Disable Success',
    deleteSuccess: 'Delete Success',
    disconnectSuccess: 'Disconnect Success',
    clear: 'Clear Success',
    from: 'From',
    stop: 'Stop',
    start: 'Start',
    notice: 'Notice',
    learnMore: 'Learn More',
    confirmDisconnect: 'Confirm disconnect?',
    confirmKickOut: 'Confirm kick out?',
    confirmCleanSession: 'Confirm Clean Session?',
    yes: 'Yes',
    no: 'No',
    online: 'Online',
    offline: 'Offline',
    warning: 'Warning',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    unsubscribeConfirm: 'This action will cancel subscription to the topic',
    pleaseEnter: 'Please Enter',
    copy: 'Copy',
    copySuccess: 'Copy successfully',
    copyFailed: 'Copy failed',
    generate: 'Generate',
    search: 'Search',
    reset: 'Reset',
    next: 'Next',
    prev: 'Previous',
    fileTip: 'Please upload file',
    uploadFailed: 'Upload failed',
  },
  // topbar
  topbar: {
    tryEnterprise: 'Free Trial',
  },
  // leftbar
  leftbar: {
    // MONITORING
    monitor: 'Monitor',
    overview: 'Overview',
    clients: 'Clients',
    connections: 'Connections',
    sessions: 'Sessions',
    topics: 'Topics',
    subscriptions: 'Subscriptions',
    // RULES
    rule_engine: 'Rule',
    // MANAGEMENT
    management: 'Management',
    plugins: 'Plugins',
    modules: 'Modules',
    listeners: 'Listeners',
    instances: 'Instances',
    // TOOLS
    tools: 'Tools',
    websocket: 'Websocket',
    api: 'HTTP API',
    applications: 'Applications',
    // ADMIN
    admin: 'Admin',
    users: 'Users',
    settings: 'Settings',
    help: 'Help',
    general: 'General',
    // Analysis
    analysis: 'Analysis',
    topicMetrics: 'Topic metrics',
    alarms: 'Alarms',
  },
  // overview
  overview: {
    // Broker
    broker: 'Broker',
    erlangOTPRelease: 'Erlang/OTP Release',
    systemName: 'System Name',
    version: 'Version',
    uptime: 'Uptime',
    systemTime: 'System Time',
    // Nodes
    nodes: 'Nodes',
    name: 'Name',
    erlangProcesses: 'Erlang Processes',
    cpuInfo: 'CPU Info',
    memoryInfo: 'Memory Info',
    memory: 'Memory',
    maxFds: 'MaxFds',
    status: 'Status',
    // Stats
    stats: 'Stats',
    topicsCount: 'Topics',
    topicsMax: 'Max',
    connectionsCount: 'Connections',
    connectionsMax: 'Max',
    retainedCount: 'Retained',
    retainedMax: 'Max',
    sessionsCount: 'Sessions',
    sessionsMax: 'Max',
    subscribersCount: 'Subscribers',
    subscribersMax: 'Max',
    subscriptionsCount: 'Subscriptions',
    subscriptionsMax: 'Max',
    subscriptionsSharedCount: 'Subscriptions Shared',
    subscriptionsSharedMax: 'Max',
    // Metrics
    metrics: 'Metrics',
    packetsData: 'The packets data',
    messagesData: 'The messages data',
    bytesData: 'The bytes data',
    session: 'Session',
    client: 'Client',
    delivery: 'Delivery',
  },
  clients: {
    node: 'Node',
    nodeName: 'Node Name',
    clientId: 'Client ID',
    username: 'Username',
    ipAddr: 'IP Address',
    port: 'Port',
    cleanStart: 'CleanStart',
    keepalive: 'Keepalive(s)',
    back: 'Back',
    subscriptionsCount: 'Subscriptions Count',
    expiryInterval: 'Expiry Interval(s)',
    maxInflight: 'MaxInflight',
    inflightLen: 'Inflight Len',
    mqueueLen: 'MqueueLen',
    mqueueDropped: 'MqueueDropped',
    awaitingRelLen: 'AwaitingRelLen',
    deliverMsg: 'DeliverMsg',
    enqueueMsg: 'EnqueueMsg',
    createdAt: 'Created At',
    connectedAt: 'Connected At',
    connected: 'Connect Status',
    basicInfo: 'Basic Info',
    subsInfo: 'Subscriptions',
    protoVer: 'ProtoVer',
    protoName: 'Protocol Name',
    protoType: 'Protocol',
    connectInfo: 'Connection',
    isBridge: 'Is Bridge',
    disconnectAt: 'Disconnect At',
    session: 'Session',
    max: 'Maximum',
    historicHigh: 'Historic High of',
    subscriptions: 'Subscriptions Count',
    inflight: 'Inflight Window Size',
    mqueue: 'Message Queue Size',
    awaiting_rel: 'Unconfirmed PUBREC Packets Count',
    recv_cnt_desc: 'Number of TCP Packets Received',
    recv_msg_desc: 'Number of PUBLISH Packets Received',
    recv_oct_desc: 'Number of Bytes Received',
    recv_pkt_desc: 'Number of MQTT Packets Received',
    send_cnt_desc: 'Number of TCP Packets Sent',
    send_msg_desc: 'Number of PUBLISH Packets Sent',
    send_oct_desc: 'Number of Bytes Sent',
    send_pkt_desc: 'Number of MQTT Packets Sent',
    currentSubs: 'Subscriptions Count',
    addSubs: 'Add Subscription',
    view: 'View',
    disconnected: 'Disconnected',
    kickOut: 'Kick Out',
  },
  // topics
  topics: {
    topic: 'Topic',
    node: 'Node',
  },
  // subscriptions
  subscriptions: {
    clientId: 'Client ID',
    topic: 'Topic',
    qoS: 'QoS',
    share: 'Share',
  },
  // plugins
  plugins: {
    name: 'Name',
    version: 'Version',
    description: 'Description',
    status: 'Status',
    stopped: 'Stopped',
    running: 'Running',
    oper: 'Operation',
    start: 'Start',
    stop: 'Stop',
    config: 'Config',
    manage: 'Manage',
    tutorial: 'Tutorial',
    back: 'Back',
    advancedConfig: 'Advanced Config',
    add: 'Add',
    configSuccess: 'Config success',
    configFailure: 'Config failure',
    notice: 'Are you sure you want to submit changes and apply them ?',
    giveUpNotice: 'Are you sure you want to give up the change and exit?',
    noticeTitle: 'Notice',
    cacheNotice: 'You have given up this change',
    emptyConfigOption: 'No Default Configuration',
    searchByName: 'Search by plugin name',
    usernameRequired: 'username is required',
    passwordRequired: 'password is required',
    clientidRequired: 'Client ID is required',
    algorithm: 'Algorithm',
    secret: 'Secret or Private key',
    payloadDesc:
      'It is valid when verify_claims is enabled. You can use% u and% c placeholders to replace the entered user name and clientid respectively. For details, see',
    jwtDoc: 'JWT Authentication',
    dataDesc: 'One line is a set of data, separated by comma username,clientid',
    secretRequired: 'Secret is required',
    payloadRequired: 'Payload template is required',
    dataRequired: 'Payload data is required',
    leaveTokenPage:
      'After leaving the page, the currently entered configuration and generated TOKEN information are no longer retained. Continue?',
  },
  modules: {
    name: 'Name',
    enable: 'Enable',
    disable: 'Disable',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },
  // instances
  instances: {
    instances: 'Instances',
    back: 'Back',
    info: 'Basic Info',
    name: 'instance name',
    descr: 'description',
    service: 'service',
    configInfo: 'Config Options',
    initConfig: 'Init config or ',
    remarkConfig: 'description is required',
    createInstance: 'Create Instance',
    selectServiceType: 'Instance Type',
    all: 'All',
    running: 'Running',
    stopped: 'Stopped',
    auth: 'Auth',
    backend: 'Backend',
    hook: 'hook',
    bridge: 'Bridge',
    other: 'Other',
    select: 'Select',
    selected: 'Selected',
    nextStep: 'Next',
    authDesc: 'Provide login authentication and publish subscribe ACL service.',
    backendDesc: 'Provide message persistence to database services.',
    bridgeDesc: 'Bridging a message flow into a message middleware data source.',
    hookDesc: 'A service that uses the trigger callback mechanism to respond to the operation.',
    otherDesc: 'The system runs information and other services.',
  },
  // listeners
  listeners: {
    protocol: 'Protocol',
    listenOn: 'Listen On',
    maxConnections: 'Max Connections',
    currentConnections: 'Current Connections',
  },
  // websocket
  websocket: {
    // Connect
    connect: 'Connect',
    host: 'Host',
    port: 'Port',
    clientID: 'Client ID',
    username: 'Username',
    password: 'Password',
    keepAlive: 'Keep Alive',
    cleanSession: 'Clean Session',
    disconnect: 'Disconnect',
    currentState: 'Current State',
    // Subscribe
    subscribe: 'Subscribe',
    topic: 'Topic',
    qoS: 'QoS',
    date: 'Date',
    oper: 'Operation',
    // Messages
    messages: 'Messages',
    retained: 'Retained',
    send: 'send',
    messagesAlreadySent: 'Messages already sent',
    messagesReceived: 'Messages received',
    time: 'Time',
    connectError: 'Message send error',
    connectFailure: 'Connect failed on',
    connectLeave: 'The client does not connect to the broker',
    subscribeSuccess: 'Subscribe success',
    subscribeFailure: 'Subscribe failure',
    unsubscribeFailure: 'Unsubscribe Failure',
    messageSendOut: 'Message send out',
    connected: 'CONNECTED',
    connecting: 'CONNECTING',
    disconnected: 'DISCONNECTED',
    notSupport: "Your browser doesn't support WebSocket",
  },
  // http_api
  httpApi: {
    introduction: 'Introduction',
    desc:
      'Apart from this help page, all URIs will serve only resources of type application/json, and will require HTTP basic authentication. The default user is admin / public.\n' +
      '<br/>' +
      "The emqx_dashboard plugin provides a web management console. The Dashboard helps monitor broker's running status, statistics and metrics of MQTT packets.",
    reference: 'Reference',
    method: 'Method',
    path: 'Path',
    description: 'Description',
    back: 'Back',
    linkAddress: 'Request address',
    data: 'Response data',
  },
  // applications
  app: {
    appId: 'AppID',
    secret: 'AppSecret',
    newApp: 'New App',
    viewApp: 'View App',
    editApp: 'Edit App',
    create: 'Create',
    errors: 'Option Required',
    name: 'AppName',
    desc: 'Remark',
    expired: 'Expired date',
    status: 'Status',
    enable: 'Allowed',
    disable: 'Denied',
    enableText: 'Access allowed',
    disableText: 'Access barred',
    expiredText: 'Never expired',
    guide: 'Application for authentication of EMQX Management API (REST API)',
    docs: 'Documentation',
  },
  // users
  users: {
    newUser: 'New User',
    editUser: 'Edit User',
    username: 'Username',
    remark: 'Remark',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    changePassword: 'Change Password',
    dontChangePassword: "Don't Change Password",
    confirm: 'Confirm',
    confirmDelete: 'Confirm Delete ?',
    usernameRequired: 'Username required',
    remarkRequired: 'Remark required',
    usernameIllegal: 'Username length: 3~32',
    passwordRequired: 'Password required',
    newPasswordRequired: 'new password required',
    passwordInconsistent: 'Password is inconsistent',
    authenticate: 'You have changed your password. Please re authenticate',
    createUser: 'Create user success',
    passwordIllegal: 'Password length: 3~255',
  },
  // alert
  alert: {
    required: 'required',
    success: ' success',
    failure: ' failure',
    connect: 'Connect',
  },
  // login
  login: {
    title: 'LOG IN',
    username: 'Username',
    password: 'Password',
    remember: 'Remember',
    loginButton: 'Log In',
    error: 'Username Or Password Error',
    usernameRequired: 'Username Required',
    passwordRequired: 'Password Required',
  },
  // settings
  settings: {
    themes: 'Themes',
    language: 'Language',
    apply: 'Apply',
    success: 'Apply success',
  },
  // importConfig
  config: {
    importConfig: 'Import',
    selectConfigFile: 'Select a config file',
    configFileMustBeJson: 'Config file must be JSON',
    createBy: 'Create by',
    create: '',
    createUser: 'owner',
    nodeName: 'node name',
    host: 'host',
    descr: 'description',
    createAt: 'create At',
    more: 'more',
    reSelect: 'Select another',
    not_a_valid_config_file: 'Not a valid config file',
    payload_error: 'Config option is empty',
    import_file_error: 'Import failure',
    exportConfig: 'Export',
    ex: 'Export',
    atLeastThree: 'At least three words',
    importSuccess: 'Import success',
    notice:
      'Use backup configuration files to configure initialization modification. <br/> Notice: configuration files may contain important data, such as database address and authentication information. Please keep good configuration files and use backup function reasonably.',
  },
  help: {
    quickStart: 'Quick start',
    emqxDesc:
      'EMQX is a MQTT broker developed on the Erlang/OTP platform, which is the most popular MQTT message middleware in the open source community. It supports common IoT protocols, including MQTT, LwM2M, MQTT-SN, CoAP, LoRaWAN, HTTP, and WebSocket. Welcome to follow our project or participate in development.',
    emqxEnterprise: 'EMQX Enterprise Edition',
    enterpriseDesc:
      'EMQX Enterprise Edition has built-in data persistence support, security auditing, operation monitoring and other functions, providing you with the service of more comprehensive functions, enhanced stability and performance, and higher level of data security and service response.<br/>The latest Enterprise Edition includes a new Dashboard, which allows you to easily create and manage IoT Hub clusters with dozens of nodes and millions of connections.',
    freeTrial: 'Free Trial',
    useDocs: 'Documentation',
    docsDesc:
      'We have prepared a comprehensive documentation to help you familiarize yourself with more powerful features.',
    forwardView: 'View documentation',
    faqDesc:
      'The FAQ contains questions that we are often asked about. It is recommended to use the FAQ to retrieve problems you encounter during use.',
    forwardFaq: 'Go to FAQ',
    followUs: 'Follow us',
    ytLink: 'https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q',
  },
  analysis: {
    topicMetrics: 'Topic metrics',
    metricsTip: '(The metrics are real-time refresh data, including all statistics since the addition)',
    messageIn: 'Message In',
    messageOut: 'Message Out',
    messageDrop: 'Message Drop',
    addTopic: 'Add Topic',
    details: 'Details',
    all: 'All',
    rateItem: '{0} / second',
    rate: '(rate)',
    messageInDesc: '(message in rate)',
    messageOutDesc: '(message out rate)',
    messageDropDesc: '(message drop rate)',
    loadAnalysis: 'Load',
    loadSuccess: 'Load Success',
    alarmName: 'Alarm Name',
    alarmMessage: 'Alarm Message',
    activateAt: 'Activate At',
    deactivateAt: 'Deactivate At',
    duration: 'Duration',
    durationTips: 'Days: Hours: Minutes: Seconds',
    currentAlarms: 'Current Alarms',
    historicalAlarm: 'Historical Alarms',
    deactivate: 'Deactivate',
    clearAll: 'Clear All',
    confirmClear: 'Confirm clear all alarms?',
    confirmDeactivate: 'Confirm deactivate this alarm?',
  },
  httpCode: {
    0: 'Success',
    101: 'Bad RPC',
    102: 'Unknown Error',
    103: 'Username or password error',
    104: 'Empty username or password',
    105: 'User does not exist',
    106: 'Admin can not be deleted',
    107: 'Missing request parameter',
    108: 'Request parameter type error',
    109: 'Request parameter is not a json',
    110: 'Plugin has been loaded',
    111: 'Plugin has been unloaded',
    112: 'Client not online',
    113: 'User already exist',
    114: 'Old password error',
    115: 'Bad topic',
  },
  util: {
    day: 'day | days',
    year: 'year | years',
  },
}
