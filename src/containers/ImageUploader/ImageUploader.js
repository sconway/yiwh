import React, { Component } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import Spinner from 'components/Spinner/Spinner';
import './ImageUploader.scss';


export default class ImageUploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            didImageDrop: false,
            didImageLoad: false,
            imagePreview: null
        };
    }

    /**
     * Called when the image close button is clicked. Sets the image uploader
     * state back to the default.
     */
    onImageClose = () => {
        this.setState({
            didImageDrop: false,
            didImageLoad: false,
            imagePreview: null
        });

        // Set the image URL back to null in the parent's state.
        this.props.updateStoryImage(null);
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
                didImageDrop: true,
                imagePreview: files[0].preview
            });

            // Set the story image based on the dropped file
            this.props.updateStoryImage(files[0]);
        }
    }

    /**
     * Called when the preview image is loaded. Sets the state 
     * that toggles the spinner loader.
     */    
    onImageLoad = () => this.setState({ didImageLoad: true });

    render() {
        const domain = this.props.domain === 'high' ? 'high' : 'drunk';
        const imageClasses = classNames('image-uploader__preview', {
            'loaded': this.state.didImageLoad
        });
        const dropzoneClasses = classNames('image-uploader__dropzone', {
            'image-dropped': this.state.didImageDrop
        });

        return (
            <form className='image-uploader'>
                <Dropzone
                    accept='image/*'
                    activeClassName='active'
                    className={dropzoneClasses}
                    multiple={false}
                    onDrop={this.onImageDrop}
                    rejectClassName='rejected'
                >
                    {({isDragActive, isDragReject}) => {
                        if (isDragReject) return `Are you dragging an image from another site? How ${domain} are you?`;
                        if (isDragActive) return 'Looks good to me. Drop that shit.';
                        return 'Drop an image or click to select a file to upload.';
                    }}
                </Dropzone>

                {this.state.didImageDrop && !this.state.didImageLoad && <Spinner />}

                {this.state.imagePreview && (
                    <div>
                        <button 
                            className='image-uploader__close mdl-button mdl-button--fab mdl-button--colored mdl-button--secondary mdl-js-button mdl-js-ripple-effect'
                            onClick={this.onImageClose}
                        >
                            <span className='image-uploader__close__x'>+</span>
                        </button>

                        <img 
                            alt='preview of the uploaded file'
                            className={imageClasses} 
                            onLoad={this.onImageLoad}
                            src={this.state.imagePreview} 
                            title='file preview'
                        />
                    </div>
                )}
            </form>
        );
    }
}
