import '../css/Prizes.css'

function Prizes(){
    return(
        <div className="prize-container" id="prizes">
            <table className="prize-table">
                <caption className="prize-heading">Categories</caption>
                <tr>
                    <td className="category-row">Best Overall Game</td>
                    <td className="category-row">£500</td>
                </tr>
                <tr>
                    <td className="category-row">Most Innovative Use of Time</td>
                    <td className="category-row">£300</td>
                </tr>
                <tr>
                    <td className="category-row">Best Functional Programming Game</td>
                    <td className="category-row">£500</td>
                </tr>
                <tr>
                    <td className="category-row">Best Graphics</td>
                    <td className="category-row">£400</td>
                </tr>
                <tr>
                    <td className="category-row">Best Co-op Game</td>
                    <td className="category-row">£500</td>
                </tr>
                <tr>
                    <td className="category-row">People's Choice</td>
                    <td className="category-row">£400</td>
                </tr>
                <tr>
                    <td className="category-row">Trackr Innovation Award</td>
                    <td className="category-row"></td>
                </tr>
            </table>
        </div>
    )
}

export default Prizes
