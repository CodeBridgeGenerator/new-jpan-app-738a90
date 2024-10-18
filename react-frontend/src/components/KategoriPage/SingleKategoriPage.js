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


const SingleKategoriPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    

    useEffect(() => {
        //on mount
        client
            .service("kategori")
            .get(urlParams.singleKategoriId, { query: { $populate: [            {
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
                props.alert({ title: "Kategori", type: "error", message: error.message || "Failed get kategori" });
            });
    }, [props,urlParams.singleKategoriId]);


    const goBack = () => {
        navigate("/kategori");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Kategori</h3>
                </div>
                <p>kategori/{urlParams.singleKategoriId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Kategori</label><p className="m-0 ml-3" >{_entity?.kategori}</p></div>
            

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
      <CommentsSection
        recordId={urlParams.singleKategoriId}
        user={props.user}
        alert={props.alert}
        serviceName="kategori"
      />
        
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

export default connect(mapState, mapDispatch)(SingleKategoriPage);
