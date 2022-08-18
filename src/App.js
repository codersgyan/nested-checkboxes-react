import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const boxes = [
    {
        title: 'Finacial',
        key: 'financial',
        checked: false,
        children: [
            {
                title: 'BANK_ACCOUNT_NUMBER',
                key: 'bank_account_number',
                checked: false,
            },
            {
                title: 'BANK_ROUTING',
                key: 'bank_routing',
                checked: false,
            },
        ],
    },
    {
        title: 'Personal',
        key: 'personal',
        checked: false,
        children: [
            {
                title: 'NAME',
                key: 'name',
                checked: false,
            },
            {
                title: 'ADDRESS',
                key: 'address',
                checked: false,
            },
        ],
    },
    {
        title: 'Technical security',
        key: 'technical_security',
        checked: false,
        children: [
            {
                title: 'USERNAME',
                key: 'username',
                checked: false,
            },
            {
                title: 'PASSWORD',
                key: 'password',
                checked: true,
            },
        ],
    },
];

function App() {
    const [checkboxes, setCheckboxes] = useState(boxes);
    const [isSelectedAll, setIsSelectedAll] = useState(false);

    const handleSelectAll = () => {
        const updatedBoxes = checkboxes.map((checkbox) => {
            return {
                ...checkbox,
                checked: !isSelectedAll,
                children: checkbox.children.map((childrenBox) => {
                    return {
                        ...childrenBox,
                        checked: !isSelectedAll,
                    };
                }),
            };
        });
        setCheckboxes(updatedBoxes);
        setIsSelectedAll((prev) => !prev);
    };

    useEffect(() => {
        const isAllChecked = checkboxes.every((checkbox) => checkbox.checked);
        setIsSelectedAll(isAllChecked);
    }, [checkboxes]);

    const countSelected = (idx) => {
        return checkboxes[idx].children.reduce((acc, current) => {
            acc = current.checked ? acc + 1 : acc;
            return acc;
        }, 0);
    };

    const handleCheckboxChange = (ownIdx, parentIdx) => {
        if (parentIdx === null) {
            // update parent only, and make all its children checked
            setCheckboxes((prevState) => {
                const updatedState = prevState.map((checkbox, index) => {
                    return index === ownIdx
                        ? {
                              ...checkbox,
                              checked: !checkbox.checked,
                              children: checkbox.children.map((childBox) => {
                                  return {
                                      ...childBox,
                                      checked: !checkbox.checked,
                                  };
                              }),
                          }
                        : checkbox;
                });
                return updatedState;
            });
        } else {
            setCheckboxes((prevState) => {
                const updatedState = prevState.map((checkbox, index) => {
                    if (index === parentIdx) {
                        const current = {
                            ...checkbox,
                            children: checkbox.children.map(
                                (children, index) => {
                                    return index === ownIdx
                                        ? {
                                              ...children,
                                              checked: !children.checked,
                                          }
                                        : children;
                                }
                            ),
                        };
                        current.checked = current.children.every(
                            (element) => element.checked
                        );
                        return current;
                    } else {
                        return checkbox;
                    }
                });
                return updatedState;
            });
        }
    };
    return (
        <div className="App">
            <div>
                <label htmlFor="all">Select all</label>
                <input
                    type="checkbox"
                    value="all"
                    checked={isSelectedAll}
                    onChange={handleSelectAll}
                />
            </div>
            <ul className="mainUl">
                {checkboxes.map((box, idx) => {
                    return (
                        <li key={box.key} className="outerLi">
                            <input
                                onChange={() => {
                                    handleCheckboxChange(idx, null);
                                }}
                                name={box.key}
                                id={box.key}
                                checked={box.checked}
                                type="checkbox"
                                value={box.val}
                            />
                            <label htmlFor={box.key}>{box.title}</label>{' '}
                            {(() => {
                                const selectedCount = countSelected(idx);
                                if (selectedCount) {
                                    return (
                                        <span>({selectedCount} Selected)</span>
                                    );
                                }
                            })()}
                            {box.children.length && (
                                <ul className="innerUl">
                                    {box.children.map((child, index) => {
                                        return (
                                            <li
                                                key={child.key}
                                                className="innerLi">
                                                <input
                                                    onChange={() => {
                                                        handleCheckboxChange(
                                                            index,
                                                            idx
                                                        );
                                                    }}
                                                    name={child.key}
                                                    id={child.key}
                                                    checked={child.checked}
                                                    type="checkbox"
                                                    value={child.val}
                                                />
                                                <label htmlFor={child.key}>
                                                    {child.title}
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default App;
