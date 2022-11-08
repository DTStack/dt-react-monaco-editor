export const sqlText = `-- name dt-react-monaco-editor
-- type dtsql
-- author jingyu@dtstack.com
-- desc 
create table if not exists exam_dim_shop (
    shop_id                string comment '店铺id',
    shop_name              string comment '店铺名称',
    shop_type              string comment '店铺类型',
    address                string comment '店铺地址'
)comment '店铺维度表'
PARTITIONED BY (ds string) lifecycle 365;
`;

export const flinkText = `-- name dt-react-monaco-editor
-- type dtflink
-- author jingyu@dtstack.com
-- desc 
Create Table catalog_name.db_nametable_name( 
    a int comment 'column comment', 
    b bigint, 
    c varchar 
)comment 'table comment' 
With( 
    update.mode='append', 
    connector.type='kafka'
)
`;

export const python2Text = `## name dt-react-monaco-editor
## type dtflink
## author jingyu@dtstack.com
## desc 
def sava_python_model(ins: object, path: str, hdfs_host: str, hadoop_username: str = None) -> None:
    """ 存储python组件至hdfs上"""
    res = dill.dumps(ins)
    fs = create_hdfs_client(hdfs_host, hadoop_username)

    path = os.path.join(path, 'model.pkl')
    if fs.exists(path):
        fs.delete(path)
    fs.create(data=res, path=path, overwrite=True)
`;

export const python3Text = `## name dt-react-monaco-editor
## type dtflink
## author jingyu@dtstack.com
## desc 
class ClusterEvaluateAi(Model):
    def __init__(self, parameter, application_id):
        Model.__init__(self, parameter, application_id)

    def run(self):

        # get the path of input and load the data return DataFrame
        input_data_params = super().get_input_parameters()
        input_data = super().get_data(**input_data_params)

        # get predict x and model
        col_names = super().get_parameter(fist="col_settings", second="col")
        model_path = super().get_input_data(data="input_model")
        model = super().load_model(model_path)
        x = input_data[col_names]
        y = model.predict(x)

        # get the the path of the output from the model
        index_out = super().get_output_data("index")

        # generate the index
        index_data = gen_index(x, y)
        print(index_data)

        # 上传到hdfs中
        super().upload_to_hdfs(data=index_data, path=index_out, sep="\t")
        print("cluster evaluation has been already successfully executed")
`;

export const jsonText = `{
    "foo": 1,
    "bar": {
        "bas": 3
    }
}
`;

export const greenPlumSqlText = `-- name dt-react-monaco-editor
-- type dtGreenPlum SQL language
-- author qiming@dtstack.com
-- desc 
create table if not exists exam_dim_shop (
    shop_id                string comment '店铺id',
    shop_name              string comment '店铺名称',
    shop_type              string comment '店铺类型',
    address                string comment '店铺地址'
)comment '店铺维度表'
with (
    appendonly=true, compresslevel=5, orientation=column, 
)
distributed by (shop_id, shop_type);
`;
