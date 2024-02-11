import {useState} from "react";
import AppBar from "../../components/AppBar/AppBar";
import FilesAppLayout from "../../components/FilesAppLayout/FilesAppLayout";
import "@cloudscape-design/global-styles/index.css"

import {defaultBreadcrumbs} from "../../components/breadcrumbs-items";
import TableListFiles from "../../components/TableListFiles/TableListFiles";
// import UploadFileCard from "../../components/UploadFileCard/UploadFileCard";
import TransparentShapingWrapper from "../../components/EnhanceUFC/TransparentShapingWrapper";
import {SpaceBetween} from "@cloudscape-design/components";

export default function Main(props) {

    return (
        <>
            <AppBar/>
            <FilesAppLayout
                breadcrumbs={defaultBreadcrumbs}
                title={props.level == 'private' ? "My Private Files" : "All public files"}
            >
                <SpaceBetween size="l">
                    <TransparentShapingWrapper level={props.level} onChange={() => {}}/>
                    <TableListFiles level={props.level}/>
                </SpaceBetween>
            </FilesAppLayout>

        </>
    );
}