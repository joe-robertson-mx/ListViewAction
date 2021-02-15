import React, {Component} from "react";
import { DataSourceHelper } from "src/Shared/DataSourceHelper/DataSourceHelper";

export interface ButtonProps {
    onClick: (dataSourceHelper:DataSourceHelper|undefined, microflow:string) => void,
    dataSourceHelper: DataSourceHelper|undefined,
    microflow:string,
    btnText: string,
    btnGlyph:string|null
}

export class Button extends Component<ButtonProps> {
    
    private onClickHandle = this.onClick.bind (this)

    private onClick () {
        this.props.onClick(this.props.dataSourceHelper, this.props.microflow)
    }
        
    render() {
        return <button 
                    className="btn mx-button"
                    onClick={this.onClickHandle}
                >
                    {this.props.btnGlyph!=null?<span className= {`glyphicon glyphicon-${this.props.btnGlyph}`}></span>:null}
                    {this.props.btnText}
                </button>
    }
}
