import React,{Component} from 'react';

class Table extends Component {
    render(){
        return (
            <table>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                {
                    this.props.users.map(user => (
                        <tr><td>{user.name}</td><td>{user.score}</td></tr>
                    ))
                }
            </table>
        )
    }
}

export default Table;