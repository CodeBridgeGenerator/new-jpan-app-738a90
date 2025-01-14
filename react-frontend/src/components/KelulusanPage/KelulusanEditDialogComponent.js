import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

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

const KelulusanCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [namaLatihan, setNamaLatihan] = useState([])
const [pelulus, setPelulus] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount latihan
                    client
                        .service("latihan")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleLatihanId } })
                        .then((res) => {
                            setNamaLatihan(res.data.map((e) => { return { name: e['tajuk'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Latihan", type: "error", message: error.message || "Failed get latihan" });
                        });
                }, []);
 useEffect(() => {
                    //on mount pelulus
                    client
                        .service("pelulus")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singlePelulusId } })
                        .then((res) => {
                            setPelulus(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Pelulus", type: "error", message: error.message || "Failed get pelulus" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            namaLatihan: _entity?.namaLatihan?._id,
pelulus: _entity?.pelulus?._id,
status: _entity?.status,
komen: _entity?.komen,
        };

        setLoading(true);
        try {
            
        await client.service("kelulusan").patch(_entity._id, _data);
        const eagerResult = await client
            .service("kelulusan")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "namaLatihan",
                    service : "latihan",
                    select:["tajuk"]},{
                    path : "pelulus",
                    service : "pelulus",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info kelulusan updated successfully" });
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

    const namaLatihanOptions = namaLatihan.map((elem) => ({ name: elem.name, value: elem.value }));
const pelulusOptions = pelulus.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Kelulusan" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="kelulusan-edit-dialog-component">
                <div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="namaLatihan">NamaLatihan:</label>
            <Dropdown id="namaLatihan" value={_entity?.namaLatihan?._id} optionLabel="name" optionValue="value" options={namaLatihanOptions} onChange={(e) => setValByKey("namaLatihan", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="pelulus">Pelulus:</label>
            <Dropdown id="pelulus" value={_entity?.pelulus?._id} optionLabel="name" optionValue="value" options={pelulusOptions} onChange={(e) => setValByKey("pelulus", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="status">Status:</label>
            <InputText id="status" className="w-full mb-3 p-inputtext-sm" value={_entity?.status} onChange={(e) => setValByKey("status", e.target.value)}  required  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="komen">Komen:</label>
            <InputTextarea id="komen" rows={5} cols={30} value={_entity?.komen} onChange={ (e) => setValByKey("komen", e.target.value)} autoResize  required  />
        </span>
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

export default connect(mapState, mapDispatch)(KelulusanCreateDialogComponent);
