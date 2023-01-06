import jaLocale from 'element-ui/lib/locale/lang/ja'

export default {
  ...jaLocale,
  // グローバル
  select: {
    cluster: '全てのノード',
    placeholder: '選択してください',
  },
  error: {
    networkError: 'ネットワークエラーが発生しました',
    initializationError: '初期状態に戻すときに問題が発生しました',
    module_not_loaded: '関連モジュールが有効になっていません',
  },
  // success
  success: {
    createSuccess: '新規が成功しました',
  },
  // oper
  oper: {
    confirmDelete: '本当に削除しますか？',
    confirmStop: '本当に停止処理を実行しますか？',
    confirm: '確認',
    cancel: 'キャンセル',
    delete: '削除',
    oper: 'オペレーション',
    edit: '編集',
    save: '保存',
    create: '新規',
    view: '詳細',
    viewMore: 'さらに表示',
    expand: '展開',
    collapse: '折り畳み',
    refresh: 'リフレシュ',
    add: '新規',
    addSuccess: '追加しました',
    editSuccess: '更新しました',
    startSuccess: '開始しました',
    stopSuccess: '停止しました',
    enableSuccess: '有効になりました',
    disabledSuccess: '無効になりました',
    deleteSuccess: '削除しました',
    disconnectSuccess: '正常に接続が切れました',
    from: 'から',
    stop: '停止',
    start: '開始',
    notice: 'お知らせ',
    learnMore: 'もっと詳しく知る',
    confirmDisconnect: '今すぐ切断しますか？',
    confirmKickOut: 'クライアントを強制的に切断しますか？',
    confirmCleanSession: 'セッションをクリアしてもよろしいですか？',
    yes: 'はい',
    no: 'いいえ',
    online: 'オンライン',
    offline: 'オフライン',
    warning: 'ワーニング',
    subscribe: 'サブスクライブ',
    unsubscribe: 'アンサブスクライブ',
    unsubscribeConfirm: 'アンサブスクライブしてもよろしいですか',
    pleaseEnter: '入力してください',
    copy: 'コピー',
    copySuccess: 'コピーが成功しました',
    copyFailed: 'コピーが失敗しました',
    generate: '生成',
    search: '検索',
    reset: 'リセット',
    next: '次へ',
    prev: '前へ',
    fileTip: 'ファイルをアップロード',
    uploadFailed: 'アップロード失敗',
  },
  // topbar
  topbar: {
    tryEnterprise: '無料トライアル',
  },
  // leftbar
  leftbar: {
    // MONITORING
    monitor: 'モニター',
    overview: 'コンソール',
    clients: 'クライアント',
    topics: 'トピック',
    subscriptions: 'サブスクリプション',
    // RULES
    rule_engine: 'ルール',
    // MANAGEMENT
    plugins: 'プラグイン',
    modules: 'モジュール',
    listeners: 'リスナー',
    // TOOLS
    tools: 'ツール',
    websocket: 'Websocket',
    api: 'API',
    // APPLICATIONS
    applications: 'アプリケーション',
    // ADMIN
    users: 'ユーザー',
    settings: '設定',
    help: 'ヘルプ',
    general: '汎用',
    // Analysis
    analysis: '分析',
    topicMetrics: 'トピック分析',
    slowSub: 'Slow Subscriptions',
    logTrace: 'Log Trace',
    alarms: 'アラート',
  },
  // overview
  overview: {
    // Broker
    broker: 'ブローカー',
    systemName: 'システム名',
    version: 'バージョン',
    uptime: '稼働時間',
    systemTime: 'システム時間',
    // Nodes
    nodes: 'ノード情報',
    name: 'ノード名',
    erlangOTPRelease: 'Erlang/OTP バージョン',
    erlangProcesses: 'Erlang プロセス',
    cpuInfo: 'CPU',
    memoryInfo: 'メモリ情報',
    memory: 'メモリー',
    maxFds: 'ファイルオープン上限数',
    status: 'ステータス',
    // Stats
    stats: '統計',
    topicsCount: 'トピック数',
    topicsMax: 'トピックの最大数',
    connectionsCount: '接続数',
    connectionsMax: '最大の接続数',
    retainedCount: '最新保持したメッセージ数',
    retainedMax: '最新保持したメッセージの最大数',
    sessionsCount: 'セッション数',
    sessionsMax: 'セッションの最大数',
    subscribersCount: 'サブスクライブ登録者数',
    subscribersMax: 'サブスクライブ登録者の最大数',
    subscriptionsCount: 'サブスクリプション数',
    subscriptionsMax: 'サブスクリプションの最大数',
    subscriptionsSharedCount: '共有したサブスクリプション数',
    subscriptionsSharedMax: '共有したサブスクリプションの最大数',
    // Metrics
    metrics: 'メトリック',
    packetsData: 'MQTT メッセージ',
    messagesData: 'メッセージ',
    bytesData: 'バイド',
    session: 'セッション',
    client: 'クライアント',
    delivery: 'デリバリー',
  },
  // Clients
  clients: {
    node: 'ノード',
    nodeName: 'ノード名',
    clientId: 'クライアントID',
    username: 'ユーザー名',
    ipAddr: 'IP アドレス',
    port: 'ポート',
    cleanStart: 'クリア',
    keepalive: 'キープアライブ（秒）',
    back: '戻る',
    subscriptionsCount: 'カレントのサブスクリプション数',
    expiryInterval: 'タイムアウト間隔（秒）',
    maxInflight: '最大の渋滞',
    inflightLen: '現在の渋滞',
    mqueueLen: 'キャッシュされているメッセージ',
    mqueueDropped: 'メッセージドロップ',
    awaitingRelLen: '解放待ち',
    deliverMsg: '配信',
    enqueueMsg: 'メッセージエンキュー',
    createdAt: 'セッション作成日時',
    connectedAt: '接続日時',
    connected: '接続ステータス',
    clientsDetails: '詳細',
    basicInfo: '基本情報',
    subsInfo: 'サブスクリプションリスト',
    protoVer: 'プロトコルバージョン',
    protoName: 'プロトコル名',
    protoType: 'プロトコルタイプ',
    connectInfo: '接続情報',
    isBridge: 'ブリッジフラグ',
    disconnectAt: '切断日時',
    session: 'セッション情報',
    max: '最大の',
    subscriptions: 'サブスクリプション数',
    inflight: 'インフライト',
    mqueue: 'メッセージキュー',
    awaiting_rel: '未確認のPUBRECパケット数',
    recv_cnt_desc: '受け取った TCP メッセージ数',
    recv_msg_desc: '受け取った PUBLISH メッセージ数',
    recv_oct_desc: '受け取ったバイト数',
    recv_pkt_desc: '受け取った MQTT メッセージ数',
    send_cnt_desc: '送信された TCP メッセージ数',
    send_msg_desc: '送信された PUBLISH メッセージ数',
    send_oct_desc: '送信されたバイト数',
    send_pkt_desc: '送信された MQTT メッセージ数',
    recv_msg_qos0: '受信したQoS0メッセージ',
    recv_msg_qos1: '受信したQoS1メッセージ',
    recv_msg_qos2: '受信したQoS2メッセージ',
    recv_msg_dropped: 'ドロップされたメッセージ',
    recv_msg_dropped_expired: 'ドロップされたメッセージ（期限切れ）',
    send_msg_qos0: '送信されたQoS0メッセージ',
    send_msg_qos1: '送信されたQoS1メッセージ',
    send_msg_qos2: '送信されたQoS2メッセージ',
    send_msg_dropped: 'ドロップされたメッセージ',
    send_msg_dropped_expired: 'ドロップされたメッセージ（期限切れ）',
    send_msg_dropped_queue_full: 'ドロップされたメッセージが出力されました（キューがいっぱいです）',
    send_msg_dropped_too_large: 'ドロップされたメッセージ（メッセージ特大）',
    currentSubs: 'カレントのサブスクリプション数',
    addSubs: 'サブスクリプション追加',
    view: '詳細',
    disconnected: '未接続',
    kickOut: 'キックアウト',
  },
  // topics
  topics: {
    topic: 'トピック',
    node: 'ノード',
  },
  // subscriptions
  subscriptions: {
    clientId: 'クライアントID',
    topic: 'トピック',
    qoS: 'QoS',
    share: 'サブスクライブ',
  },
  // plugins
  plugins: {
    name: 'プラグイン名',
    version: 'バージョン',
    description: '用途',
    status: 'ステータス',
    stopped: '停止済',
    running: '実行中',
    start: '開始',
    stop: '停止',
    config: '設定',
    manage: '管理',
    tutorial: 'ドキュメント',
    back: '戻る',
    advancedConfig: '詳細設定',
    add: '新規',
    configSuccess: '設定に成功しました',
    configFailure: '設定に失敗しました',
    notice: 'プラグインの設定を変更してもよろしいですか？プラグインを再起動した後に有効になります',
    giveUpNotice: '変更されたプラグインの設定を破棄してもよろしいですか？',
    noticeTitle: 'お知らせ',
    cacheNotice: 'キャンセルされました',
    emptyConfigOption: 'デフォルトの設定項目が空です',
    searchByName: 'プラグイン名で検索',
    usernameRequired: 'ユーザー名を入力してください',
    passwordRequired: 'パスワードを入力してください',
    clientidRequired: 'クライアントIDを入力してください',
    algorithm: 'アルゴリズム',
    secret: 'シークレット',
    payloadDesc:
      '%uと%cプレースホルダは、入力したユーザー名とクライアントIDの代わりに使用できます（verify_claimsを起動する場合）、詳細はこちらへ',
    jwtDoc: 'JWT認証',
    dataDesc: 'データセットは行で表示されています。ユーザー名とクライアントIDはコンマで区切られます',
    secretRequired: 'シークレットを入力してください',
    payloadRequired: 'Payloadのテンプレートを入力してください',
    dataRequired: 'Payloadのデータを入力してください',
    leaveTokenPage:
      '現在のページを離れると、入力内容及び生成したTOKENが失われます。このまま処理を続けてもよろしいですか？',
    invalidSignature: '無効な秘密鍵',
  },
  modules: {
    name: 'モジュール名',
    enable: '有効にする',
    disable: '無効にする',
    enabled: '有効',
    disabled: '無効',
  },
  // instances
  instances: {
    instances: 'インスタンス',
    back: '戻る',
    info: '基本情報',
    name: 'インスタンス名',
    descr: '備考',
    service: 'サービス',
    configInfo: '設定',
    initConfig: '初期設定',
    remarkConfig: '備考を入力してください',
    createInstance: '新規インスタンス',
    selectServiceType: 'インスタンスタイプ',
    all: '全て',
    running: '実行中',
    stopped: '停止済',
    auth: '認証',
    backend: 'バックエンド',
    hook: 'フック',
    bridge: 'ブリッジ',
    other: 'その他',
    select: '選択',
    selected: '選択済',
    nextStep: '次のステップ',
    authDesc: 'ログイン認証を提供し、ACLサービスのパブリッシュ及びサブスクライブ',
    backendDesc: '指定したデータベースにメッセージを保存する',
    bridgeDesc: 'メッセージミドルウェアのデータソースとして、メッセージフローをブリッジするためのサービス',
    hookDesc: 'トリガーによるコールバック起動できるサービス',
    otherDesc: 'システム稼働情報やその他のサービス',
  },
  // listeners
  listeners: {
    protocol: 'プロトコル',
    listenOn: 'アドレス',
    maxConnections: '最大の接続数',
    currentConnections: '現在の接続数',
  },
  // websocket
  websocket: {
    // Connect
    connect: '接続',
    host: 'ホスト',
    port: 'ポート',
    clientID: 'クライアントID',
    username: 'ユーザー名',
    password: 'パスワード',
    keepAlive: 'キープアライブ（秒）',
    cleanSession: 'セッションクリア',
    disconnect: '切断',
    currentState: 'カレントステータス',
    // Subscribe
    subscribe: 'サブスクライブ',
    topic: 'トピック',
    qoS: 'QoS',
    date: 'サブスクライブ日時',
    oper: 'オペレーション',
    // Messages
    messages: 'メッセージ',
    retained: '最新保持',
    send: '送信する',
    messagesAlreadySent: '送信されたメッセージリスト',
    messagesReceived: '受け取ったメッセージリスト',
    time: '時間',
    connectError: '接続エラーが発生しました',
    connectFailure: '接続に失敗しました',
    connectLeave: 'サーバーに接続されていません',
    subscribeSuccess: 'サブスクライブが成功にしました',
    subscribeFailure: 'サブスクライブが失敗にしました',
    messageSendOut: 'メッセージが送信されました',
    connected: '接続済',
    connecting: '接続中',
    disconnected: '未接続',
    notSupport: 'お使いのブラウザはWebSocketをサポートしていません',
  },
  // http_api
  httpApi: {
    introduction: '説明',
    desc:
      'ヘルプページを除いて、すべてのURIはapplication / json形式でリソースを返し、各リクエストにはHTTP基本認証が必要です。デフォルトのユーザー名とパスワードはadmin / publicです。<br/>' +
      'emqx_dashboardプラグインは、サーバーの実行ステータス、データ統計、MQTTパケット数を可視化するためのWeb管理コンソールを提供します。',
    reference: 'リファレンス',
    method: 'メソッド',
    path: 'パス',
    description: '詳細',
    back: '戻る',
    linkAddress: 'リクエストURL',
    data: 'レスポンスデータ',
  },
  // applications
  app: {
    appId: 'App ID',
    secret: 'App secret',
    newApp: '新規',
    viewApp: '詳細',
    editApp: ' 編集',
    errors: 'この項目は入力が必須です',
    name: 'App名',
    desc: '備考',
    expired: '有効期限',
    status: 'ステータス',
    enable: '有効',
    disable: '無効',
    enableText: '有効になります',
    disableText: '無効になります',
    expiredText: '有効期限なし',
    guide: 'EMQX REST API を利用してアプリケーションを構築するガイド、詳細はこちらへ',
    docs: 'ドキュメント',
  },
  // users
  users: {
    newUser: '新規',
    editUser: '編集',
    username: 'ユーザー名',
    remark: '備考',
    password: 'パスワード',
    confirmPassword: 'パスワード確認用',
    oldPassword: '古いパスワード',
    newPassword: '新しいパスワード',
    confirmNewPassword: '新しいパスワード確認用',
    changePassword: 'パスワード変更',
    dontChangePassword: 'キャンセル',
    usernameRequired: 'ユーザー名を入力してください',
    remarkRequired: '備考を入力してください',
    usernameIllegal: 'ユーザー名の長さ: 3~32',
    passwordRequired: 'パスワードを入力してください',
    newPasswordRequired: '新しいパスワードを入力してください',
    passwordInconsistent: '新パスワードと再入力パスワードが一致しません',
    authenticate: 'パスワードが変更されたので、もう一度ログインしてください',
    createUser: 'ユーザーを作成しました',
    passwordIllegal: 'パスワードの長さ: 3~255',
    noSameNewPwd: '新しいパスワードと古いパスワードを同じにすることはできません',
    jumpLoginTip: 'パスワードの変更に成功しました、もう一度ログインしてください',
    passwordRequirement:
      'パスワードの長さは 8 ～ 64 文字である必要があります。 文字、数字、記号のうち少なくとも 2 つを含む',
  },
  // alert
  alert: {
    required: '必須項目です',
    success: 'が成功しました',
    failure: 'が失敗しました',
    connect: '接続',
  },
  // login
  login: {
    title: 'ログイン',
    username: 'ユーザー名',
    password: 'パスワード',
    remember: 'ログイン状態を保持する',
    loginButton: 'ログイン',
    error: 'ユーザー名またはパスワードが間違っています',
    usernameRequired: 'ユーザー名を入力してください',
    passwordRequired: 'パスワードを入力してください',
    defaultPwdTip: 'デフォルトのパスワードでログインしていることが検出されました。時間内にパスワードを変更してください',
  },
  // settings
  settings: {
    themes: 'テーマ',
    language: 'システム言語',
    apply: 'アプライ',
    success: '更新しました',
  },
  // importConfig
  config: {
    importConfig: '設定をインポートする',
    selectConfigFile: '設定ファイルを選択してください',
    configFileMustBeJson: 'バックアップファイルがJSON形式であることを確認してください',
    createBy: '作成者：',
    create: '新規',
    createUser: '新規ユーザー',
    nodeName: 'ノード名',
    host: 'ホスト',
    descr: '備考',
    createAt: '作成日時',
    more: 'もっと詳しく知る',
    reSelect: 'もう一度選択',
    not_a_valid_config_file: '有効な設定ファイルではありません',
    payload_error: '無効なコンテンツが含まれています',
    import_file_error: '設定ファイルをインポートするときにエラーが発生しました',
    exportConfig: '設定をエクスポートする',
    ex: 'エクスポート',
    atLeastThree: '少なくとも3つの文字',
    importSuccess: '正しくインポートできました',
    notice:
      'バックアップした設定ファイルを使用して設定を初期化/変更します。<br/>※ 設定ファイルには、データベースアドレスや認証情報などの重要なデータが含まれている可能性があります。設定ファイルを適切に保管してください。',
  },
  help: {
    quickStart: 'クイックスタート',
    emqxDesc:
      'EMQX Brokerは、高い並行処理指向のErlang / OTPに基づいて、オープンソースコミュニティで最も人気のあるMQTT ブローカーです。MQTT、LwM2M、MQTT-SN、CoAP、LoRaWAN、HTTP、WebSocketなどの豊富なIoTプロトコルをサポートしています。EMQX Brokerが良かったと思われる方は、GitHubでフォローしていただけると嬉しいです。更に、皆様からのコントリビューションを歓迎します。',
    emqxEnterprise: 'EMQX Enterprise',
    enterpriseDesc:
      'EMQX Enterpriseにおいて、様々なデータ永続化、セキュリティ監視サービス、稼働監視など機能を提供しています。無料体験版より包括的な機能、より強力な安定性とパフォーマンス、より厳密なセキュリティのメリットがあります。<br/>更に、新しいダッシュボードが含まれ、1つのIoT Hubクラスターにより数百万のデバイス接続を簡単に作成及び管理できます。',
    freeTrial: '無料トライアル',
    useDocs: 'ドキュメント',
    docsDesc: 'EMQX Brokerの全機能に関する役立つドキュメントを用意しています。',
    forwardView: 'ドキュメントを見る',
    faqDesc:
      'EMQX Brokerの使用中にエラー（「一時的なエラー」など）が発生した場合、よくあるご質問ページを参考にして問題を解決することをお勧めします。',
    forwardFaq: 'よくあるご質問',
    followUs: 'フォローする',
  },
  analysis: {
    topicMetrics: 'トピック分析',
    metricsTip: '（メトリックはすべての統計を含む、データがリアルタイムで反映されます）',
    messageIn: 'メッセージ流入',
    messageOut: 'メッセージ流出',
    messageDrop: 'メッセージドロップ',
    addTopic: 'トピック追加',
    details: '詳細データ',
    all: '全て',
    rateItem: '{0} 件/秒',
    rate: '（頻度）',
    messageInDesc: '（メッセージ流入頻度）',
    messageOutDesc: '（メッセージ流出頻度）',
    messageDropDesc: '（メッセージドロップ頻度）',
    loadAnalysis: '有効にする',
    loadSuccess: '有効になりました',
    alarmName: 'アラート名',
    alarmMessage: 'アラート内容',
    activateAt: '開始日時',
    deactivateAt: '終了日時',
    duration: '持続時間',
    durationTips: '日：時間：分：秒',
    currentAlarms: 'カレントアラート',
    historicalAlarm: 'アラート履歴',
    deactivate: '無効にする',
    clearAll: '全てクリア',
    confirmClear: '全てのアラートをクリアにしてもよろしいですか？',
    confirmDeactivate: '全てのアラートを無効にしてもよろしいですか？',
  },
  slowSub: {
    slowSub: '遅いサブスクリプション',
    slowSubDesc: '（送信が遅いサブスクライバーをカウントし、履歴レコードを生成し、統計情報を定期的にプッシュします）',
    latencyTime: '待ち時間',
    updated: '更新しました',
    clearData: 'クリアデータ',
    clearSlowSubscriptionConfirm: '現在のデータをクリアし、遅いサブスクリプションを再カウントします',
  },
  logTrace: {
    logTrace: 'ログ追跡',
    logTraceDesc:
      '（デバッグとトラブルシューティングのために、指定されたClientID、トピック、またはIPのログをリアルタイムでフィルター処理します）',
    activeList: 'アクティブログトレースリスト',
    finishedList: '完成したログトレースリスト',
    name: '名前',
    type: 'タイプ',
    condition: '調子',
    startTime: '始まる時間',
    endTime: '終了時間',
    startEndTime: '開始時間/終了時間',
    status: '状態',
    logSize: 'ログサイズ',
    view: '意見',
    download: 'ダウンロード',
    stop: 'やめる',
    delete: '消去',
    waiting: '待っている',
    running: 'ランニング',
    createLog: 'トレースを作成',
    viewLog: 'トレースを表示',
    createSuc: 'ログトレースを正常に作成する',
    stopSuc: 'ログトレースを正常に停止します',
    deleteSuc: 'ログトレースを正常に削除する',
    tooLargeLog: 'トレースが長すぎるため、ダウンロードして表示することをお勧めします',
    confirmDeleteTrace: 'このトレースを削除することを確認します',
    needStartTime: '開始時間または終了時間が必要です',
    needOnePacket: '少なくとも1つのパケットを選択してください',
    loadNextPage: 'より多くのログをロードする',
    srunning: 'ランニング',
    sstopped: '停止',
    swaiting: '待っている',
    backToList: 'ログ追跡リストに戻る',
    validString: '有効な値を入れてください',
  },
  httpCode: {
    0: '成功しました',
    101: 'RPC 操作に失敗しました',
    102: '未知のエラーが発生しました',
    103: 'ユーザー名またはパスワードが間違っています',
    104: 'ユーザー名とパスワードを入力してください',
    105: 'ユーザーは存在しません',
    106: '管理者を削除できません',
    107: 'リクエストパラメータが正しくないために、エラーが発生しました',
    108: 'リクエストパラメータタイプが正しくないために、エラーが発生しました',
    109: 'リクエスト本文がJSON形式ではありません',
    110: 'プラグインは既に有効になります',
    111: 'プラグインは既に無効になります',
    112: 'クライアントはオンラインではありません',
    113: 'ユーザー名は既に存在しています',
    114: '入力された古いパスワードが正しくありません',
    115: 'テーマを変更するときにエラーが発生しました',
  },
  util: {
    day: '日',
    year: '年',
  },
}
