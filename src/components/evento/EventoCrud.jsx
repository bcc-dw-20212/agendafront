import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'eventos',
    title: 'Agenda de eventos',
    subtitle: 'Cadastro de eventos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://127.0.0.1:8000/eventos/'
const initialState = {
    evento: { title: '', description: '', evento_date: '', reminder: '', author: '', duration: 0 },
    list: []
}

export default class EventoCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ evento: initialState.evento })
    }

    save() {
        const evento = this.state.evento
        const method = evento.id ? 'put' : 'post'
        const url = evento.id ? `${baseUrl}${evento.id}` : baseUrl
        axios[method](url, evento)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ evento: initialState.evento, list })
            })
    }

    getUpdatedList(evento, add = true) {
        const list = this.state.list.filter(u => u.id !== evento.id)
        if (add) list.unshift(evento)
        return list
    }

    updateField(e) {
        const evento = { ...this.state.evento }
        evento[e.target.title] = e.target.value
        this.setState({ evento })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Título</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.evento.title}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o título..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Autor</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.evento.author}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o autor..." />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(evento) {
        this.setState({ evento })
    }

    remove(evento) {
        axios.delete(`${baseUrl}${evento.id}`).then(resp => {
            const list = this.getUpdatedList(evento, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(evento => {
            return (
                <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td>{evento.title}</td>
                    <td>{evento.author}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(evento)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(evento)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}