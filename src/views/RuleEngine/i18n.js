export const en = {
  viewStates: 'Status',
  node: 'node',
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
  events: {
    message_acked: 'message.acked',
    message_dropped: 'message.dropped',
    message_publish: 'message.publish',
    message_deliver: 'message.deliver',
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
  delete_success: 'Delete success',
  action_exists: 'Action already exists',
  cancel: 'Cancel',
  resource_mgmt: 'Resources',
  name: 'Name',
  resource_type: 'Resource Type',
  description: 'Description',
  create_success: 'Create success',
  type: 'Type',
  value: 'Value',
  edit: 'Edit',
  add: 'Add',

  basic_info: 'Basic Info',
  rule_name_required: 'rule name required',
  rule_sql: 'SQL',
  rule_descr_placeholder: 'e.g.message render to Webhook',
  rule_sql_tips_title: 'Write SQL statements for conditional filtering and data processing:',
  sql_tips_html: `<p>The EMQ X rules engine is triggered by an event, and the event type can be specified by the FROM clause of SQL.</p>

  <p class="item">
    When the event is triggered, it carries the context information of the event, including the message content and
    event parameters. Data can be filtered and processed from context information using the SELECT command with the
    WHERE clause. The fields available in the context information of each event can be acquired from EMQ X document.
  </p>

  <p class="item">
    Events filtered through the SQL statement will trigger corresponding response actions, such as persisting to the
    database, republishing processed messages, forwarding messages to message queues, and so on. A single rule can
    configure multiple response actions.
  </p>

  <p>1. Select the message published to the 't/#' topic and filter out all fields:</p>

  <div class="code">
    <code>SELECT * FROM "message.publish" WHERE topic =~ 't/#'</code>
  </div>

  <p>2. Select the message published to the 't/a' topic and filter the "x" field from the json-formatted message
    content:</p>

  <div class="code">
    <code>SELECT payload.x as x FROM "message.publish" WHERE topic =~ 't/a'</code>
  </div>

  <p>3. Select the login message with the username 'emqx' and filter out the ClientID field.</p>
  <div class="code">
    <code>SELECT client_id FROM "client.connected" WHERE username = 'emqx'</code>
  </div>

  <p>See the EMQ X documentation for a detailed tutorial on the rules engine and SQL statements.</p>`,
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
  resource_name: 'Name',
  resource_details: 'Details',
  config_info: 'Configuration',
}

export const zh = {
  viewStates: '状态',
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
  events: {
    message_acked: '消息确认',
    message_dropped: '消息丢弃',
    message_publish: '消息发布',
    message_deliver: '消息投递',
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
  delete_success: '删除成功',
  action_exists: '动作已存在',
  cancel: '取消',
  resource_mgmt: '资源管理',
  name: '名称',
  resource_type: '资源类型',
  description: '备注',
  create_success: '创建成功',
  type: '类型',
  value: '值',
  edit: '编辑',
  add: '添加',

  basic_info: '基本信息',
  rule_name_required: '请输入规则名称',
  rule_sql: '规则 SQL',
  rule_descr_placeholder: 'e.g.消息转发到 Webhook',
  rule_sql_tips_title: '编写 SQL 进行条件过滤与数据处理：',
  sql_tips_html: `<p>EMQ X 规则引擎由事件触发，可通过 SQL 的 FROM 子句指定事件类型。</p>
  
  <p class="item">事件触发时会携带事件的上下文信息，包含了消息内容与事件参数等。可使用 SELECT 子句 和 WHERE 子句，
    从上下文信息中过滤和处理数据。每个事件上下文信息中可用的字段参见 EMQ X 文档。
  </p>

  <p class="item">经过 SQL 语句筛选通过的事件，将会触发对应的响应动作，比如持久化到数据库、重新发布处理后的消息、转发消息到消息队列等。一条规则可以配置多个响应动作。</p>

  <p>1. 选择发布到 't/#' 主题的消息，并筛选出全部字段：</p>

  <div class="code">
    <code>SELECT * FROM "message.publish" WHERE topic =~ 't/#'</code>
  </div>

  <p>2. 选择发布到 't/a' 主题的消息，并从 JSON 格式的消息内容中筛选出 "x" 字段：</p>

  <div class="code">
    <code>SELECT payload.x as x FROM "message.publish" WHERE topic =~ 't/a'</code>
  </div>

  <p>3. 选择用户名为 'emqx' 的登录消息，并筛选出 ClientID 字段。</p>
  <div class="code">
    <code>SELECT client_id FROM "client.connected" WHERE username = 'emqx'</code>
  </div>

  <p>规则引擎和 SQL 语句的详细教程参见 EMQ X 文档。</p>`,
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
  resource_name: '资源名称',
  resource_details: '资源详情',
  config_info: '配置信息',

  events_rule: '事件规则',
  create_rule: '事件规则',
  events_type: '事件类型',
}
