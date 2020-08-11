import PropTypes from 'prop-types'
import React from 'react'
import { SHOW_ACTIVE, SHOW_ALL, SHOW_COMPLETED } from '../constants/TodoFilters'
import FilterLink from '../containers/FilterLink'
import { Route } from 'react-router-dom'

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

const Footer = (props) => {
  const { activeCount, completedCount, onClearCompleted, user, onSignOut } = props
  const itemWord = activeCount === 1 ? 'item' : 'items'
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter =>
          <li key={filter}>
            <FilterLink filter={filter}>
              {FILTER_TITLES[filter]}
            </FilterLink>
          </li>
        )}
      </ul>
      <Route path="/" render={props => 
        user 
          ? <button
              className="clear-completed"
              onClick={() => onSignOut()}>
             sign out {user}
          </button> 
          : <button
              className="clear-completed"
              onClick={() => props.history.push('/signup')}>
              sign up
          </button>
      }></Route>
    </footer>
  )
}

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  user: PropTypes.string
}

export default Footer
