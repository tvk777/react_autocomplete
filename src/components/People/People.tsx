import { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { debounce } from '../utils';
import s from './People.module.scss';

interface Props {
  people: Person[];
}

export const People: FC<Props> = ({ people }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [query, setQuery] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const debouncedFilter = useRef(
    debounce((value: string) => {
      const filtered = people.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()),
      );

      setFilteredPeople(filtered);
    }, 300),
  ).current;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);

    if (selectedPerson) {
      setSelectedPerson(null);
    }

    debouncedFilter(value);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(prev => !prev);

  return (
    <div>
      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <div
        className={cn('dropdown', { 'is-active': isOpen })}
        ref={containerRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onClick={toggleDropdown}
            value={query}
            onChange={handleChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className={`dropdown-item ${s.dropdownItem}`}
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!filteredPeople.length && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
