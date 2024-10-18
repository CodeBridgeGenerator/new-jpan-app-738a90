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


const SingleDokumenPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [tajukLatihan, setTajukLatihan] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("dokumen")
            .get(urlParams.singleDokumenId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"tajukLatihan"] }})
            .then((res) => {
                set_entity(res || {});
                const tajukLatihan = Array.isArray(res.tajukLatihan)
            ? res.tajukLatihan.map((elem) => ({ _id: elem._id, tajuk: elem.tajuk }))
            : res.tajukLatihan
                ? [{ _id: res.tajukLatihan._id, tajuk: res.tajukLatihan.tajuk }]
                : [];
        setTajukLatihan(tajukLatihan);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Dokumen", type: "error", message: error.message || "Failed get dokumen" });
            });
    }, [props,urlParams.singleDokumenId]);


    const goBack = () => {
        navigate("/dokumen");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Dokumen</h3>
                </div>
                <p>dokumen/{urlParams.singleDokumenId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Url</label><p><img id="url" src={_entity?.url} className="m-0 ml-3" width={300}  /></p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">TajukLatihan</label>
                    {tajukLatihan.map((elem) => (
                        <Link key={elem._id} to={`/latihan/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.tajuk}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
      <CommentsSection
        recordId={urlParams.singleDokumenId}
        user={props.user}
        alert={props.alert}
        serviceName="dokumen"
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

export default connect(mapState, mapDispatch)(SingleDokumenPage);
