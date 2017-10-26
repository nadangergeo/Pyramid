import ContainCentered from "./ContainCentered";
import Zoomable from "./Zoomable";
import {Media, Image} from "./Media";

const ImageViewer = Zoomable(ContainCentered(Image));

export default ImageViewer;