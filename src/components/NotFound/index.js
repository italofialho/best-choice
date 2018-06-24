import React, { Component } from "react";

class NotFoundPage extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>Oops!</h1>
                            <h2>404 Not Found</h2>
                            <div className="error-details">
                                Desculpe, ocorreu um erro, a página solicitada
                                não encontrada!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFoundPage;
