import React, { useEffect, useState } from 'react';
import { produce } from 'immer';
import axios from 'axios';

import BoardContext from './context';

import List from '../List';

import { ContainerBoard } from './styles';
import { LIST_CODES } from '../../utils/constants';
import { useParams } from 'react-router-dom';

function loadLists() {
  return [
    {
      title: 'Backlog',
      creatable: true,
      code: LIST_CODES.BACKLOG,
    },
    {
      title: 'Sprint Backlog',
      creatable: false,
      code: LIST_CODES.SPRINT_BACKLOG,
    },
    {
      title: 'Development',
      creatable: false,
      code: LIST_CODES.DEVELOPMENT,
    },
    {
      title: 'Done Development',
      creatable: false,
      code: LIST_CODES.DONE_DEVELOPMENT,
    },
    {
      title: 'Test',
      creatable: false,
      code: LIST_CODES.TEST,
    },
    {
      title: 'Done Test',
      creatable: false,
      code: LIST_CODES.DONE_TEST,
    },
    {
      title: 'Rework',
      creatable: false,
      code: LIST_CODES.REWORK,
    },
    {
      title: 'DONE',
      creatable: false,
      done: true,
      code: LIST_CODES.DONE,
    },
  ];
}

const data = loadLists();

export default function Board() {
  const [lists, setLists] = useState(data);
  const [tasks, setTasks] = useState([]);
  const [allocatedUsers, setAllocatedUsers] = useState([]);

  const { projectId } = useParams();

  function move(fromList, toList, from, to) {
    setLists(produce(lists, draft => {
      const dragged = draft[fromList].cards[from];

      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }))
  }

  const fetchProjectMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Alocacao_projeto/${projectId}`
      );
      if (response.status === 200) {
        const allocatedUserIds = response.data.map(
          (allocation) => allocation.usuario
        );
        const allocatedUsersData = rows.filter((usuario) =>
          allocatedUserIds.includes(usuario.id)
        );
        setAllocatedUsers(allocatedUserIds);
        // console.log("ids", allocatedUserIds);
        // console.log("data", allocatedUsersData);
      } else if (response.status === 409) {
        console.error('Erro ao buscar membros alocados ao projeto no backend.');
      }
    } catch (error) {
      console.error('Erro ao conectar-se ao backend:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Atividade/${projectId}`
      ); // Substitua pela sua URL de API
      if (response.status === 200) {
        setTasks(response.data);
      } else {
        console.error('Erro ao buscar listas');
      }
    } catch (error) {
      console.error('Erro ao conectar-se ao backend:', error);
    }
  };

  const getFilteredTasks = (code) => {
    console.log({ code, tasks });
    return tasks?.filter((task) => task.estado === code);
  };

  useEffect(() => {
    const intervalId = setInterval(fetchProjectMembers, 60000);
    fetchTasks();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BoardContext.Provider value={{ lists, move }}>
      <ContainerBoard>
        {lists.map((list, index) => (
          <List
            key={list.title}
            index={index}
            data={list}
            tasks={getFilteredTasks(list.code)}
            allocatedUsers={allocatedUsers}
          />
        ))}
      </ContainerBoard>
    </BoardContext.Provider>
  );
}
