import ContainCentered from "../../hocs/ContainCentered";
import Zoomable from "../../hocs/Zoomable";
import {Media, Image} from "../Media";

const ImageViewer = Zoomable(ContainCentered(Image));

export default ImageViewer;