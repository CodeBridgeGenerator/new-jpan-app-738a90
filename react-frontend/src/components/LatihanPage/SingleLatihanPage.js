import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import client from "../../services/restClient";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import CommentsSection from "../../common/CommentsSection";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import KelulusanPage from "../KelulusanPage/KelulusanPage";
import DokumenPage from "../DokumenPage/DokumenPage";

const SingleLatihanPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    

    useEffect(() => {
        //on mount
        client
            .service("latihan")
            .get(urlParams.singleLatihanId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },] }})
            .then((res) => {
                set_entity(res || {});
                
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Latihan", type: "error", message: error.message || "Failed get latihan" });
            });
    }, [props,urlParams.singleLatihanId]);


    const goBack = () => {
        navigate("/latihan");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Latihan</h3>
                </div>
                <p>latihan/{urlParams.singleLatihanId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">NomborRujukan</label><p className="m-0 ml-3" >{_entity?.nomborRujukan}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Tajuk</label><p className="m-0 ml-3" >{_entity?.tajuk}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Kategori</label><p className="m-0 ml-3" >{_entity?.kategori}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Status</label><p className="m-0 ml-3" >{_entity?.status}</p></div>
            

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
      <CommentsSection
        recordId={urlParams.singleLatihanId}
        user={props.user}
        alert={props.alert}
        serviceName="latihan"
      />
        <KelulusanPage/>
<DokumenPage/>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleLatihanPage);
