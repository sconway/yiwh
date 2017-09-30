import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { url } from 'global/js/config.js';


const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/yesiwas/upload';
const UPLOAD_PRESET = 'yesiwas';

export default class ImageUploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedFile: null,
            uploadedFileCloudinaryUrl: ''
        };
    }

    /**
     * Called when an image is dropped in the uploader. Makes sure there is
     * a file to be uploaded, and sets the state with it.
     *
     * @param      {Array} : files
     */
    onImageDrop = (files) => {
        if (files.length > 0) {
            this.setState({
                uploadedFile: files[0]
            });

            this.handleImageUpload(files[0]);
        }
    }

    /**
     * Posts to cloudinary with the provided image and
     * updates the state with the response.
     *
     * @param     {Object} : file
     */
    handleImageUpload = (file) => {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', UPLOAD_PRESET)
                     .field('file', file);

        upload.end((err, response) => {
            if (err) console.error(err);

            // If we got a good response, update the local and parent state
            // with the url of our uploaded image.
            if (response.body.secure_url !== '') {
                this.setState({
                    uploadedFileCloudinaryUrl: response.body.secure_url
                });

                this.props.updateStoryImage(response.body.secure_url);
            }
        });
    }

    render() {
        return (
            <form>
                <div className="FileUpload">
                    <Dropzone
                        onDrop={this.onImageDrop}
                        multiple={false}
                        accept="image/*">
                        <div>Drop an image or click to select a file to upload.</div>
                    </Dropzone>
                </div>

                <div>
                    {this.state.uploadedFileCloudinaryUrl === '' ? null :
                    <div>
                        <img src={this.state.uploadedFileCloudinaryUrl} />
                    </div>}
                </div>
            </form>
        );
    }
}
