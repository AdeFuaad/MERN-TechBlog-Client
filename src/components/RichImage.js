import React from "react";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import "./RichImage.css";
import "../../node_modules/draft-js/dist/Draft.css";

class RichImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  promptForImage = (e) => {
    e.preventDefault();
    this.imageInput.click();
  };

  handleImageChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.insertImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  insertImage = (base64EncodedImage) => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src: base64EncodedImage }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    this.setState(
      {
        editorState: RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        ),
      },
      () => {
        setTimeout(() => this.refs.editor.focus(), 0);
      }
    );
  };

  mediaBlockRenderer = (block) => {
    if (block.getType() === "atomic") {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  };

  render() {
    const { editorState } = this.state;

    return (
      <div className="RichEditor-root">
        <div className="RichEditor-controls">
          {/*... other controls ...*/}
          <input
            type="file"
            ref={(input) => {
              this.imageInput = input;
            }}
            style={{ display: "none" }}
            onChange={this.handleImageChange}
          />
          <button onMouseDown={this.promptForImage}>Add Image</button>
        </div>
        <div className="RichEditor-editor" onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={(editorState) => this.setState({ editorState })}
            blockRendererFn={this.mediaBlockRenderer}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  return type === "IMAGE" ? <img src={src} alt="inserted-media" /> : null;
};

export default RichImage;
