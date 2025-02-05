// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin/contracts/token/ERC20/IERC20.sol";
import "openzeppelin/contracts/access/Ownable.sol";

contract AIPortfolioManager is Ownable {
    struct Position {
        address token;
        uint256 amount;
    }

    mapping(address => Position[]) public userPortfolios;

    event PositionAdded(address user, address token, uint256 amount);
    event PositionRemoved(address user, address token, uint256 amount);

    constructor(address initialOwner) Ownable() {}
    
    function addPosition(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        userPortfolios[msg.sender].push(Position(_token, _amount));
        emit PositionAdded(msg.sender, _token, _amount);
    }

    function removePosition(uint256 _index) external {
        require(_index < userPortfolios[msg.sender].length, "Invalid index");
        Position memory position = userPortfolios[msg.sender][_index];
        IERC20(position.token).transfer(msg.sender, position.amount);
        emit PositionRemoved(msg.sender, position.token, position.amount);
        
        // Remove position from array
        userPortfolios[msg.sender][_index] = userPortfolios[msg.sender][userPortfolios[msg.sender].length - 1];
        userPortfolios[msg.sender].pop();
    }

    function getUserPortfolio(address _user) external view returns (Position[] memory) {
        return userPortfolios[_user];
    }
}
