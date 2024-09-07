'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './editor.module.css';

const CKEditorComponent = ({ data, onChange }) => {
    return (
        <CKEditor
            onReady={(edit)=> edit.focus()}
            editor={ClassicEditor}
            data={data}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CKEditorComponent;