#!/bin/bash

function run_node() {
    node ${app_js} -c "$@"
};
function run_node_silent() {
    node ${app_js} --silent -c "$@"
};
export -f run_node;
export -f run_node_silent;

export app_js="${lib_dir}/app.js";

export tool_parse_json_js="${lib_dir}/tool-parse_json.js";
export get_connection_js="${lib_dir}/tool-get_connection.js";
export get_dataconnection_js="${lib_dir}/tool-get_dataconnection.js";
export get_dataflow_js="${lib_dir}/tool-get_dataflow.js";
export get_dataset_js="${lib_dir}/tool-get_dataset.js";
export get_datasource_js="${lib_dir}/tool-get_datasource.js";
export get_file_content_js="${lib_dir}/tool-get_file_content.js";
export get_preview_js="${lib_dir}/tool-get_preview.js";
export get_preview_hive_js="${lib_dir}/tool-get_preview_hive.js";
export get_snapshot_js="${lib_dir}/tool-get_snapshot.js";
export get_upstream_js="${lib_dir}/tool-get_upstream.js";
export get_transform_js="${lib_dir}/tool-get_transform.js";
export get_transform_count_js="${lib_dir}/tool-get_transform_count.js";
export get_transform_search_js="${lib_dir}/tool-get_transform_search.js";
export list_dataconnection_js="${lib_dir}/tool-list_dataconnection.js";
export list_dataflow_js="${lib_dir}/tool-list_dataflow.js";
export list_dataset_js="${lib_dir}/tool-list_dataset.js";
export list_snapshot_js="${lib_dir}/tool-list_snapshot.js";
export make_dataconnection_hive_js="${lib_dir}/tool-make_dataconnection_hive.js";
export make_dataconnection_mysql_js="${lib_dir}/tool-make_dataconnection_mysql.js";
export make_dataflow_with_dataset_js="${lib_dir}/tool-make_dataflow_with_dataset.js";
export make_hdfs_imported_dataset_js="${lib_dir}/tool-make_hdfs_imported_dataset.js";
export make_hive_imported_dataset_js="${lib_dir}/tool-make_hive_imported_dataset.js";
export make_jdbc_imported_dataset_js="${lib_dir}/tool-make_jdbc_imported_dataset.js";
export make_imported_dataset_js="${lib_dir}/tool-make_imported_dataset.js";
export make_snapshot_js="${lib_dir}/tool-make_snapshot.js";
export make_transform_js="${lib_dir}/tool-make_transform.js";
export rule_tester_list_js="${lib_dir}/tool-rule_tester_list.js";
export rule_tester_list_dataset_js="${lib_dir}/tool-rule_tester_list_dataset.js";
export rule_tester_put_js="${lib_dir}/tool-rule_tester_put.js";
export rule_tester_show_js="${lib_dir}/tool-rule_tester_show.js";
export set_transform_js="${lib_dir}/tool-set_transform.js";
export upload_file_js="${lib_dir}/tool-upload_file.js";
export upload_file_hdfs_js="${lib_dir}/tool-upload_file_hdfs.js";
export cancel_job_js="${lib_dir}/tool-cancel_job.js";
