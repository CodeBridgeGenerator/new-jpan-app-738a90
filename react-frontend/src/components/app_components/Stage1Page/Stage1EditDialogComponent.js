import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import UploadFilesToS3 from "../../../services/UploadFilesToS3";
import { Dropdown } from 'primereact/dropdown';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const Stage1CreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [kategori, setKategori] = useState([])
const [pelulus, setPelulus] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount kategori
                    client
                        .service("kategori")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleKategoriId } })
                        .then((res) => {
                            setKategori(res.data.map((e) => { return { name: e['kategori'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Kategori", type: "error", message: error.message || "Failed get kategori" });
                        });
                }, []);
 useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setPelulus(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            nomborRujukan: _entity?.nomborRujukan,
tajuklatihan: _entity?.tajuklatihan,
dokumen: _entity?.dokumen,
kategori: _entity?.kategori?._id,
status: _entity?.status,
pelulus: _entity?.pelulus?._id,
        };

        setLoading(true);
        try {
            
        await client.service("stage1").patch(_entity._id, _data);
        const eagerResult = await client
            .service("stage1")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "kategori",
                    service : "kategori",
                    select:["kategori"]},{
                    path : "pelulus",
                    service : "users",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info stage1 updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const kategoriOptions = kategori.map((elem) => ({ name: elem.name, value: elem.value }));
const pelulusOptions = pelulus.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Stage1" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="stage1-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="nomborRujukan">Nombor Rujukan:</label>
                <InputText id="nomborRujukan" className="w-full mb-3 p-inputtext-sm" value={_entity?.nomborRujukan} onChange={(e) => setValByKey("nomborRujukan", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["nomborRujukan"]) && (
              <p className="m-0" key="error-nomborRujukan">
                {error["nomborRujukan"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="tajuklatihan">Tajuk Latihan:</label>
                <InputText id="tajuklatihan" className="w-full mb-3 p-inputtext-sm" value={_entity?.tajuklatihan} onChange={(e) => setValByKey("tajuklatihan", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["tajuklatihan"]) && (
              <p className="m-0" key="error-tajuklatihan">
                {error["tajuklatihan"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="dokumen">Dokumen:</label>
                    <UploadFilesToS3 type={'edit'} setValByKey={setValByKey} onSave={onSave} id={urlParams.singleStage1Id} serviceName="stage1" />
                </span>
                <small className="p-error">
                {!_.isEmpty(error["dokumen"]) && (
                  <p className="m-0" key="error-dokumen">
                    {error["dokumen"]}
                  </p>
                )}
              </small>
                </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="kategori">Kategori:</label>
                <Dropdown id="kategori" value={_entity?.kategori?._id} optionLabel="name" optionValue="value" options={kategoriOptions} onChange={(e) => setValByKey("kategori", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["kategori"]) && (
              <p className="m-0" key="error-kategori">
                {error["kategori"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="status">Status:</label>
                <InputText id="status" className="w-full mb-3 p-inputtext-sm" value={_entity?.status} onChange={(e) => setValByKey("status", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["status"]) && (
              <p className="m-0" key="error-status">
                {error["status"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="pelulus">Pelulus:</label>
                <Dropdown id="pelulus" value={_entity?.pelulus?._id} optionLabel="name" optionValue="value" options={pelulusOptions} onChange={(e) => setValByKey("pelulus", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["pelulus"]) && (
              <p className="m-0" key="error-pelulus">
                {error["pelulus"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(Stage1CreateDialogComponent);
