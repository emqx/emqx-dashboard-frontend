const version = process.env.VUE_APP_VERSION

export const en = {
  viewStates: 'Status',
  topic: 'Topic',
  node: 'Node',
  all: 'All',
  connectSuccess: 'Connect success',
  speed_unit: 'times/s',
  match_unit: 'times',
  match_rate: 'Hit Rate',
  success: 'success',
  failed: 'failed',
  params: 'Params',
  matched_line: '(matched/not matched)',
  speed_line: '(current/max/last5m)',
  current: 'current',
  max: 'max',
  last5m: 'last5m',
  metrics: 'Metrics',
  speed: 'Speed(seconds)',
  speed_max: 'Speed max',
  speed_last5m: 'The last 5 minutes speed',
  rule_matched: 'Rule matched number',
  rule_nomatch: 'Number of not atched',
  speed_current: 'Matching Speed',
  speed_max_1: 'Maximum Speed',
  speed_last5m_1: 'Last5Mins Speed',
  rule_matched_1: 'Matched',
  rule_nomatch_1: 'Not Matched',
  enabled: 'In Service',
  disabled: 'Out of Service',
  running_statue: 'Running status',
  reconnect: 'Reconnect',
  connect: 'Connect',
  stopped: 'Stopped',
  running: 'Running',
  no_test_output: '',
  test_output: 'Result',
  test: 'Test',
  input_test_data: 'Test SQL',
  input_test_data_tips: 'Input mock data and test SQL',
  is_required: 'is required',
  conf_test: 'Test Connection',
  conf_test_success: 'Connection Success',
  conf_test_fail: 'Connection Failed',
  new_resource: 'New Resource',
  action_type: 'Action Type',
  event_info: 'Available Field',
  suggest_sql: 'SQL Example',
  upgrade_tip: 'Upgrade Tip',
  json_decode_upgrade:
    'The current version cancels the automatic JSON decoding of the payload. Select the field in the payload and use json_decode to decode it, as in the SQL example.',
  events: {
    message_acked: 'message.acked',
    message_dropped: 'message.dropped',
    message_publish: 'message.publish',
    message_delivered: 'message.deliver',
    client_unsubscribe: 'client.unsubscribe',
    client_subscribe: 'client.subscribe',
    client_disconnected: 'client.disconnected',
    client_connected: 'client.connected',
  },
  trigger_events: 'Trigger',
  id: 'ID',
  exists: 'exists key',
  data_key: 'KEY',
  data_value: 'VALUE',
  events_rule: 'Events Rule',
  create_rule: 'Events Rule',
  events_type: 'Events Type',
  rely_resource: 'Resource',
  actions_tips: 'Processing messages for hit rules',
  conditional_tips: 'Defining rule conditions and data processing ways through SQL',
  conditional: 'Rule condition',
  rule_engine: 'Rule Engine',
  message_rule: 'Rule',
  create: 'Create',
  rule_name: 'Rule Name',
  actions: 'Actions',
  action: 'Action',
  resource: 'Resource',
  oper: 'Operation',
  view: 'View',
  confirm: 'Confirm',
  delete: 'Delete',
  rule_details: 'Details',
  rule_desc: 'Description',
  confirm_stop_delete: 'Confirm to stop and remove ？',
  confirm_edit_resource: 'Confirm to modify the configuration information ?',
  delete_success: 'Delete success',
  action_exists: 'Action already exists',
  cancel: 'Cancel',
  resource_mgmt: 'Resources',
  name: 'Name',
  resource_type: 'Resource Type',
  description: 'Description',
  create_success: 'Create success',
  edit_success: 'Edit success',
  type: 'Type',
  value: 'Value',
  edit: 'Edit',
  add: 'Add',
  ruleEnabled: 'Enabled',
  ruleDisabled: 'Disabled',
  validateErr: 'Related required fields are not filled in!',

  basic_info: 'Basic Info',
  rule_name_required: 'rule name required',
  rule_sql: 'SQL',
  rule_id: 'Rule ID',
  rule_descr_placeholder: 'e.g.message render to Webhook',
  rule_sql_tips_title: 'Write SQL statements for conditional filtering and data processing:',
  sql_tips_html: `<p>Rule Engine is the core SQL-based data processing and distribution component on top of the standard MQTT. It makes it easy to filter and process MQTT messages and device lifecycle events and move data distribution to HTTP Server, database, message queues, or even another MQTT Broker.</p><p>1. Select the messages published to t/# and select all fields:</p><div class="code"><code>SELECT * FROM  "t/#"</code> </div><p>2. Select the client connected event and filter the device with Username \'emqx\' to get the connection information.</p><div class="code"><code>SELECT clientid, connected_at FROM "$events/client_connected" WHERE username = \'emqx\'</code></div><p>For a detailed tutorial on the rule engine and SQL queries please refer to <a target="_blank" href="https://emqx.io/docs/en/${version}/rule/rule-engine.html">EMQX Documentation</a>。</p>`,
  condition_screening: 'Condition Screening',
  topic_condition: 'Topic',
  message_publish_topic: 'Message topic',
  set_action: 'Action Handler',
  sql_required: 'SQL required',
  actions_required: 'actions required',
  rule_action_tips_title: 'Define action handlers',
  action_tips_html: `
<p> 1. Re-publish message to message server</p>

<span> Re-publishing messages to broker requires specifying the target theme</span>

<p> 2. Forwarding messages to Webhook</p>

<span> Forwarding messages to HTTP Webhook</span>`,

  resource_title: 'Resource',
  resource_des: 'Description',
  resource_id: 'Resource ID',
  id_len_tip: 'The longest 64',
  id_char_tip: 'Only Numbers, letters, underscores, and colons are supported',
  type_required: 'Type is required',
  resource_details: 'Details',
  config_info: 'Configuration',

  clientid_doc: 'Current MQTT clientid',
  username_doc: 'Current MQTT username',
  event_doc: 'Trigger event name',
  id_doc: 'MQTT message id',
  payload_doc:
    'The payload, if in JSON format, will be automatically decoded, and the object information will be obtained by using payload.x in SQL',
  peerhost_doc: 'Client peer name',
  qos_doc: 'Enumeration of message QoS 0,1,2',
  timestamp_doc: 'Timestamp(millisecond)',
  topic_doc:
    'Currently MQTT topic can be filtered by wildcards in SQL.  When multiple topics are included in subscribe and unsubscribe, only the first one will be obtained here. To obtain all topics, please use topic_filters',
  node_doc: 'Node name of the trigger event',
  message_delivered: 'message delivered',
  message_acked: 'message acked',
  message_dropped: 'message dropped',
  client_connected: 'client connected',
  client_disconnected: 'client disconnected',
  session_subscribed: 'session subscribed',
  session_unsubscribed: 'session unsubscribed',
  delivery_dropped: 'delivery dropped',
  parse_confirm: 'Detected incompatible old SQL syntax, confirm to automatically convert it to the new version?',
  fallbackAction: 'Fallback Actions',
  fallbackActionCreate: 'Set the action that will be performed when an action execution error occurs (optional)',
  fallbackActionTip: 'Action to be performed when the action execution error',
  sqlPassed: 'SQL passed',
  sqlPassedDesc: 'SQL executes successfully and outputs the result',
  sqlFailed: 'SQL failed',
  sqlFailedDesc: 'SQL execution failed due to syntax or function call failure',
  sqlNoResult: 'SQL no result',
  sqlNoResultDesc: 'SQL executes successfully but no output results',
}

export const zh = {
  viewStates: '状态',
  topic: '主题',
  node: '节点',
  all: '合计',
  connectSuccess: '连接成功',
  speed_unit: '次/秒',
  match_unit: '次',
  match_rate: '命中率',
  success: '成功',
  failed: '失败',
  params: '参数',
  matched_line: '(命中/未命中)',
  speed_line: '(当前/最大/最近5分钟)',
  current: '当前',
  max: '最大',
  last5m: '最近5分钟',
  metrics: '度量指标',
  speed: '速度(秒)',
  speed_max: '最大命中速度',
  speed_last5m: '5分钟平均速度',
  rule_matched: '匹配条数',
  rule_nomatch: '未匹配条数',
  speed_current: '命中速度',
  speed_max_1: '最大命中速度',
  speed_last5m_1: '5分钟平均速度',
  rule_matched_1: '已命中',
  rule_nomatch_1: '未命中',
  enabled: '可用',
  disabled: '不可用',
  running_statue: '运行状态',
  reconnect: '重新连接',
  connect: '连接',
  stopped: '已停止',
  running: '运行中',
  no_test_output: '暂无结果',
  test_output: '测试输出',
  test: '测试',
  input_test_data: 'SQL 测试',
  input_test_data_tips: '自定义模拟数据进行 SQL 命令测试，仅用于测试功能',
  is_required: '必填',
  conf_test: '测试连接',
  conf_test_success: '连接可用',
  conf_test_fail: '连接不可用',
  new_resource: '新建资源',
  action_type: '动作类型',
  event_info: '可用字段',
  suggest_sql: '规则 SQL 示例',
  upgrade_tip: '升级提示',
  json_decode_upgrade:
    '当前版本取消对 payload 的自动 JSON 解码，选择 payload 中的字段请使用 json_decode 解码，如 SQL 示例。',
  events: {
    message_acked: '消息确认',
    message_dropped: '消息丢弃',
    message_publish: '消息发布',
    message_delivered: '消息投递',
    client_unsubscribe: '取消订阅',
    client_subscribe: '订阅',
    client_disconnected: '连接断开',
    client_connected: '连接完成',
  },
  trigger_events: '触发事件',
  id: 'ID',
  exists: '键重复',
  data_key: '键',
  data_value: '值',
  rely_resource: '关联资源',
  actions_tips: '处理命中规则的消息',
  conditional_tips: '使用 SQL 定义规则条件与数据处理方式',
  conditional: '条件',
  rule_engine: '规则引擎',
  message_rule: '规则',
  create: '新建',
  rule_name: '规则名称',
  actions: '响应动作',
  action: '动作',
  resource: '关联资源',
  oper: '操作',
  view: '查看',
  confirm: '确认',
  delete: '删除',
  rule_details: '规则详情',
  rule_desc: '规则描述',
  confirm_stop_delete: '确认停用并删除？',
  confirm_edit_resource: '确认修改配置信息？',
  delete_success: '删除成功',
  action_exists: '动作已存在',
  cancel: '取消',
  resource_mgmt: '资源管理',
  name: '名称',
  resource_type: '资源类型',
  description: '备注',
  create_success: '创建成功',
  edit_success: '编辑成功',
  type: '类型',
  value: '值',
  edit: '编辑',
  add: '添加',
  ruleEnabled: '已启动',
  ruleDisabled: '已停止',
  validateErr: '相关必填项未填写！',

  basic_info: '基本信息',
  rule_name_required: '请输入规则名称',
  rule_sql: '规则 SQL',
  rule_id: '规则 ID',
  rule_descr_placeholder: 'e.g.消息转发到 Webhook',
  rule_sql_tips_title: '编写 SQL 进行条件过滤与数据处理：',
  sql_tips_html: `<p>规则引擎是标准 MQTT 之上基于 SQL 的核心数据处理与分发组件，可以方便的筛选并处理 MQTT 消息与设备生命周期事件，并将数据分发移动到 HTTP Server、数据库、消息队列甚至是另一个 MQTT Broker 中。</p><p>1. 选择 \'t/#\' 主题的消息，提取全部字段：</p><div class="code"><code>SELECT * FROM  "t/#"</code></div><p>2. 通过事件主题选择客户端连接事件，筛选 Username 为 \'emqx\' 的设备并获取连接信息：</p><div class="code"><code>SELECT clientid, connected_at FROM "$events/client_connected" WHERE username = \'emqx\'</code></div><p>规则引擎和 SQL 语句的详细教程参见 <a target="_blank" href="https://emqx.io/docs/zh/${version}/rule/rule-engine.html">EMQX 文档</a>。</p>`,

  condition_screening: '条件筛选',
  topic_condition: '主题条件',
  message_publish_topic: '消息发布主题',
  set_action: '响应动作',
  sql_required: '请输入 SQL',
  actions_required: '动作不能为空',
  rule_action_tips_title: '定义动作',
  action_tips_html: `
<p>1. 重新发布消息至消息服务器</p>
<span>将消息重新发布到 broker 中，需要指定目标主题</span>
<p>2. 将消息转发至 Webhook</p>
<span>将消息转发至 HTTP Webhook</span>`,

  resource_title: '资源',
  resource_des: '描述',
  resource_id: '资源 ID',
  id_len_tip: '最长64位',
  id_char_tip: '仅支持数字、字母、下划线和冒号',
  type_required: '类型必选',
  resource_details: '资源详情',
  config_info: '配置信息',

  events_rule: '事件规则',
  create_rule: '事件规则',
  events_type: '事件类型',

  clientid_doc: '当前客户端 MQTT clientid',
  username_doc: '当前客户端 MQTT username',
  event_doc: '触发事件名称',
  id_doc: 'MQTT message id',
  payload_doc: '消息内容, 如果是 JSON 格式将自动解码, 在 SQL 中使用 payload.x 获取对象信息',
  peerhost_doc: '客户端网络地址',
  qos_doc: '消息 QoS 0,1,2 中枚举',
  timestamp_doc: '当前毫秒级时间戳',
  topic_doc:
    '当前 MQTT 主题, SQL 中可以使用通配符进行筛选.\nSubscribe 与 Unsubscribe 请求中包含多个主题时, 这里只会获取到第一个, 如需获取全部请使用 topic_filters',
  node_doc: '触发事件的节点名称',
  message_delivered: '消息投递',
  message_acked: '消息应答',
  message_dropped: '消息丢弃',
  client_connected: '连接建立',
  client_disconnected: '连接断开',
  session_subscribed: '会话订阅',
  session_unsubscribed: '会话取消订阅',
  delivery_dropped: '消息投递丢弃',
  parse_confirm: '检测到不兼容的旧版 SQL 语法，是否自动转换为新版语法？',
  fallbackAction: '失败备选动作',
  fallbackActionCreate: '设置发生动作执行错误时将执行的动作（可选）',
  fallbackActionTip: '动作执行错误时将执行的操作',
  sqlPassed: 'SQL 通过',
  sqlPassedDesc: 'SQL 成功执行并输出结果',
  sqlFailed: 'SQL 失败',
  sqlFailedDesc: 'SQL 因语法或函数调用失败导致执行失败',
  sqlNoResult: 'SQL 无结果',
  sqlNoResultDesc: 'SQL 成功执行但没有输出结果',
}

export const ja = {
  viewStates: 'ステータス',
  topic: 'トピック',
  node: 'ノード',
  all: '合計',
  connectSuccess: '接続に成功しました',
  speed_unit: '回/秒',
  match_unit: '回',
  match_rate: 'ヒット率',
  success: '成功',
  failed: '失敗',
  params: 'パラメータ',
  matched_line: '(一致/不一致)',
  speed_line: '(カレント/最大/直近5分間)',
  current: 'カレント',
  max: '最大',
  last5m: '直近5分間',
  metrics: '基準',
  speed: 'スピード(秒)',
  speed_max: '最大ヒットスピード',
  speed_last5m: '5分間の平均スピード',
  rule_matched: 'ルール一致数',
  rule_nomatch: 'ルール不一致数',
  speed_current: 'ヒットスピード',
  speed_max_1: '最大ヒットスピード',
  speed_last5m_1: '5分間の平均スピード',
  rule_matched_1: '一致',
  rule_nomatch_1: '不一致',
  enabled: '利用可能',
  disabled: '利用不可',
  running_statue: '稼働状況',
  reconnect: '再接続',
  connect: '接続',
  stopped: '停止',
  running: '稼働中',
  no_test_output: '結果なし',
  test_output: 'テスト出力',
  test: 'テスト',
  input_test_data: 'SQLテスト',
  input_test_data_tips: 'SQLテスト用のカスタムシミュレーションデータ、テスト用のみ',
  is_required: 'を入力してください',
  conf_test: '接続テスト',
  conf_test_success: '接続可能',
  conf_test_fail: '接続不可能',
  new_resource: '新規リソース',
  action_type: 'アクションタイプ',
  event_info: '利用可能なフィールド',
  suggest_sql: 'SQLサンプル',
  upgrade_tip: 'アップグレードヒント',
  json_decode_upgrade:
    'カレントバージョンでは自動的にpayloadのJSONにデコード機能が廃棄されました。payloadのフィールドを選択して、json_decodeでデコードしてください。例として、',
  events: {
    message_acked: 'メッセージの肯定応答',
    message_dropped: 'メッセージドロップ',
    message_publish: 'メッセージ送信',
    message_delivered: 'メッセージ配信',
    client_unsubscribe: 'クライアントアンサブスクリプション',
    client_subscribe: 'サブスクリプション登録',
    client_disconnected: '接続切れ',
    client_connected: '接続済',
  },
  trigger_events: 'トリガーイベント',
  id: 'ID',
  exists: '重複キー',
  data_key: 'キー',
  data_value: '値',
  rely_resource: '関連リソース',
  actions_tips: 'ヒットルールメッセージの処理',
  conditional_tips: 'SQLによってルール条件とデータ処理方法を定義する',
  conditional: 'ルール条件',
  rule_engine: 'ルールエンジン',
  message_rule: 'ルール',
  create: '新規',
  rule_name: 'ルール名',
  actions: '応答アクション',
  action: 'アクション',
  resource: 'リソース',
  oper: 'オペレーション',
  view: '詳細',
  confirm: '確認',
  delete: '削除',
  rule_details: 'ルール詳細',
  rule_desc: 'ルール詳細',
  confirm_stop_delete: '停止して削除することを確認しますか？',
  confirm_edit_resource: '構成情報の変更を確認する？',
  delete_success: '削除が成功しました',
  action_exists: 'アクションがすでに存在されました',
  cancel: 'キャンセル',
  resource_mgmt: 'リソース管理',
  name: '名前',
  resource_type: 'リソースタイプ',
  description: '備考',
  create_success: '新規作成に成功しました',
  edit_success: '更新しました',
  type: 'タイプ',
  value: '値',
  edit: '編集',
  add: '追加',
  ruleEnabled: '有効になります',
  ruleDisabled: '無効になります',
  validateErr: '関連する必須フィールドは入力されていません！',

  basic_info: '基本情報',
  rule_name_required: 'ルール名を入力してください',
  rule_sql: 'ルールSQL',
  rule_id: 'ルールID',
  rule_descr_placeholder: '例：Webhookへ転送されたメッセージ',
  rule_sql_tips_title: 'SQLによる条件付きフィルタリングとデータ処理：',
  sql_tips_html: `<p>EMQXは、メッセージが公開されてイベントがトリガーされると、ルールエンジンをトリガーします。トリガー条件を適応するルールは、自体のSQLを実行し、メッセージとイベントのコンテキスト情報をフィルター処理します。</p>
  <p class="item">ルールエンジンは、応答アクションを利用して、特定のトピックのメッセージの処理結果をデータベースに格納し、HTTPサーバーに送信し、メッセージキューKafkaまたはRabbitMQに転送し、新しいトピックまたは別のBrokerクラスターに再発行できます。各ルールに対して、複数の応答アクションをデプロイ可能です。</p>

  <p>1. トピックt/#'のメッセージを選択し、全てのフィールドを絞る：</p>

  <div class="code">
    <code>SELECT * FROM  "t/#"</code>
  </div>

  <p>2. トピック't/a'のメッセージを選択し、JSON形式のメッセージからフィールド"x"を絞る：</p>

  <div class="code">
    <code>SELECT payload.x as x FROM "t/a"</code>
  </div>

  <p class="item">ルールエンジンは$events/で始まる仮トピック（イベントトピック）を使用して、EMQX内部のイベントを処理します，内部イベントはもっと細かいメッセージ制御およびクライアントアクション処理機能を提供し、QoS 1 QoS 2メッセージ到着レコード、デバイスのオンラインおよびオフラインレコードなどのサービスで使用できます。<p>

  <p>1. クライアント接続イベントを選択し、ユーザ名'emqx'の設備を接続して接続情報を取得する：</p>
  <div class="code">
    <code>SELECT clientid, connected_at FROM "$events/client_connected" WHERE username = 'emqx'</code>
  </div>

  <p>ルールエンジンとSQLの詳細説明について、EMQXのドキュメントを参考してください。</p>`,
  condition_screening: '条件付きフィルタリング',
  topic_condition: 'トピック条件',
  message_publish_topic: 'メッセージ公開トピック',
  set_action: '応答アクション',
  sql_required: 'SQLを入力してください',
  actions_required: 'アクションを選択してください',
  rule_action_tips_title: 'アクションを定義する',
  action_tips_html: `
<p>1. メッセージをメッセージサーバに再公開</p>
<span>メッセージをbrokerに再公開、目標トピックが必要</span>
<p>2. メッセージをWebhookへ転送する</p>
<span>メッセージをHTTP Webhookへ転送する</span>`,

  resource_title: 'リソース',
  resource_des: 'リソース詳細',
  resource_id: 'リソースID',
  id_len_tip: '最大64ビットまで',
  id_char_tip: '入力可能文字：半角英数字・「_（アンダースコア）」・「:（コロン）」のみ',
  type_required: 'リソースタイプを選択してください',
  resource_details: 'リソース詳細',
  config_info: '構成情報',

  events_rule: 'イベントルール',
  create_rule: '新規ルール',
  events_type: 'イベントタイプ',

  clientid_doc: 'カレントMQTTクライアントID',
  username_doc: 'カレントMQTTユーザ名',
  event_doc: 'トリガーイベント名',
  id_doc: 'MQTTメッセージid',
  payload_doc:
    'JSONフォーマットの場合、payloadが自動的にデコードされます。 SQL文中にpayload.xでオブジェクト情報を取得することができます',
  peerhost_doc: 'クライアントアドレス',
  qos_doc: 'QoS 0、1、2 のメッセージ中の列挙型',
  timestamp_doc: 'タイムスタンプ（ミリ秒）',
  topic_doc:
    'カレントMQTTトピック、SQL中にワイルドカードを使用してフィルターすることができます。 \nサブスクライブとアンサブスクライブの中に複数のトピックが存在している場合、最初のトピックだけを受け取れます。全てのデータを取得したい場合、topic_filtersを使用してください',
  node_doc: 'トリガ・イベントのノード名',
  message_delivered: 'メッセージ配信',
  message_acked: 'メッセージの肯定応答',
  message_dropped: 'メッセージドロップ',
  client_connected: '接続済',
  client_disconnected: '未接続',
  session_subscribed: 'セッションサブスクライブ',
  session_unsubscribed: 'セッションアンサブスクライブ',
  delivery_dropped: '配達が落ちました',
  parse_confirm: '互換性がないの古いバージョンのSQL文が見つかりました。新しいバージョンに変更しますか？',
  fallbackAction: 'フォールバックアクション',
  fallbackActionCreate: 'アクション実行エラーが発生したとき、エラー処理の動作を設定します（任意）',
  fallbackActionTip: 'アクション実行エラーが発生したときの動作',
  sqlPassed: 'SQLに合格',
  sqlPassedDesc: 'SQLが正常に実行され、結果が出力される',
  sqlFailed: 'SQLが失敗しました',
  sqlFailedDesc: '構文または関数呼び出しの失敗が原因でSQLの実行に失敗しました',
  sqlNoResult: 'SQLの結果なし',
  sqlNoResultDesc: 'SQLは正常に実行されますが、出力結果がありません',
}
