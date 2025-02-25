import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Chip } from "primereact/chip";
import { MultiSelect } from "primereact/multiselect";
import UploadService from "../../../services/UploadService";
import DownloadCSV from "../../../utils/DownloadCSV";

const MailQuesDataTable = ({
  items,
  fields,
  onEditRow,
  onRowDelete,
  onRowClick,
  searchDialog,
  setSearchDialog,
  showUpload,
  setShowUpload,
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  onClickSaveFilteredfields,
  selectedFilterFields,
  setSelectedFilterFields,
  selectedHideFields,
  setSelectedHideFields,
  onClickSaveHiddenfields,
  loading,
  user,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();
  const [globalFilter, setGlobalFilter] = useState("");

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.from}</p>;
  const chipTemplate2 = (rowData, { rowIndex }) => (
    <Chip label={rowData.recipients} />
  );
  const tickTemplate3 = (rowData, { rowIndex }) => (
    <i className={`pi ${rowData.status ? "pi-check" : "pi-times"}`}></i>
  );
  const pTemplate4 = (rowData, { rowIndex }) => (
    <p>{rowData.templateId?.name}</p>
  );
  const inputTextareaTemplate5 = (rowData, { rowIndex }) => (
    <p>{rowData.subject}</p>
  );
  const inputTextareaTemplate6 = (rowData, { rowIndex }) => (
    <p>{rowData.content}</p>
  );
  const p_numberTemplate7 = (rowData, { rowIndex }) => <p>{rowData.jobId}</p>;
  const inputTextareaTemplate8 = (rowData, { rowIndex }) => (
    <p>{rowData.errors}</p>
  );
  const p_calendarTemplate9 = (rowData, { rowIndex }) => <p>{rowData.end}</p>;
  const editTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onEditRow(rowData, rowIndex)}
      icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`}
      className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`}
    />
  );
  const deleteTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onRowDelete(rowData._id)}
      icon="pi pi-times"
      className="p-button-rounded p-button-danger p-button-text"
    />
  );
  const pCreatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.createdAt).fromNow()}</p>
  );
  const pUpdatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.updatedAt).fromNow()}</p>
  );

  const paginatorLeft = (
    <Button
      type="button"
      icon="pi pi-upload"
      text
      onClick={() => setShowUpload(true)}
      disabled={!false}
    />
  );
  const paginatorRight = DownloadCSV({ data: items, fileName: "download" });

  return (
    <>
      <DataTable
        value={items}
        ref={dt}
        removableSort
        onRowClick={onRowClick}
        scrollable
        rowHover
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 250, 500]}
        size={"small"}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        rowClassName="cursor-pointer"
        alwaysShowPaginator={!urlParams.singleUsersId}
        loading={loading}
      >
        <Column
          field="name"
          header="Name"
          body={pTemplate0}
          filter={selectedFilterFields.includes("name")}
          hidden={selectedHideFields?.includes("name")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="from"
          header="From"
          body={pTemplate1}
          filter={selectedFilterFields.includes("from")}
          hidden={selectedHideFields?.includes("from")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="recipients"
          header="Recipients"
          body={chipTemplate2}
          filter={selectedFilterFields.includes("recipients")}
          hidden={selectedHideFields?.includes("recipients")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="status"
          header="Status"
          body={tickTemplate3}
          filter={selectedFilterFields.includes("status")}
          hidden={selectedHideFields?.includes("status")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="templateId"
          header="Template"
          body={pTemplate4}
          filter={selectedFilterFields.includes("templateId")}
          hidden={selectedHideFields?.includes("templateId")}
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="subject"
          header="Subject"
          body={inputTextareaTemplate5}
          filter={selectedFilterFields.includes("subject")}
          hidden={selectedHideFields?.includes("subject")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="jobId"
          header="Job Id"
          body={p_numberTemplate7}
          filter={selectedFilterFields.includes("jobId")}
          hidden={selectedHideFields?.includes("jobId")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="errors"
          header="Errors"
          body={inputTextareaTemplate8}
          filter={selectedFilterFields.includes("errors")}
          hidden={selectedHideFields?.includes("errors")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="end"
          header="End"
          body={p_calendarTemplate9}
          filter={selectedFilterFields.includes("end")}
          hidden={selectedHideFields?.includes("end")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        {/* <Column header="Edit" body={editTemplate} />
        <Column header="Delete" body={deleteTemplate} /> */}
        {/*<Column field="createdAt" header="created" body={pCreatedAt} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="updatedAt" header="updated" body={pUpdatedAt} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="createdBy" header="createdBy" body={pCreatedBy} sortable style={{ minWidth: "8rem" }} />*/}
        {/*<Column field="updatedBy" header="updatedBy" body={pUpdatedBy} sortable style={{ minWidth: "8rem" }} />*/}
      </DataTable>
      <Dialog
        header="Upload MailQues Data"
        visible={showUpload}
        onHide={() => setShowUpload(false)}
      >
        <UploadService
          user={user}
          serviceName="mailQues"
          onUploadComplete={() => {
            setShowUpload(false); // Close the dialog after upload
          }}
        />
      </Dialog>

      <Dialog
        header="Search MailQues"
        visible={searchDialog}
        onHide={() => setSearchDialog(false)}
      >
        Search
      </Dialog>
      <Dialog
        header="Filter Users"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedFilterFields}
            onChange={(e) => setSelectedFilterFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedFilterFields);
            onClickSaveFilteredfields(selectedFilterFields);
            setSelectedFilterFields(selectedFilterFields);
            setShowFilter(false);
          }}
        ></Button>
      </Dialog>

      <Dialog
        header="Hide Columns"
        visible={showColumns}
        onHide={() => setShowColumns(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedHideFields}
            onChange={(e) => setSelectedHideFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedHideFields);
            onClickSaveHiddenfields(selectedHideFields);
            setSelectedHideFields(selectedHideFields);
            setShowColumns(false);
          }}
        ></Button>
      </Dialog>
    </>
  );
};

export default MailQuesDataTable;
