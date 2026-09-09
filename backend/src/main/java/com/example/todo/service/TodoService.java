package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.entity.Todo;
import com.example.todo.exception.TodoNotFoundException;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional(readOnly = true)
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Todo getTodoById(Long id) {
        return findTodoById(id);
    }

    public Todo createTodo(TodoRequest request) {
        Todo todo = new Todo();
        copyRequestToTodo(request, todo);
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, TodoRequest request) {
        Todo todo = findTodoById(id);
        copyRequestToTodo(request, todo);
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        Todo todo = findTodoById(id);
        todoRepository.delete(todo);
    }

    public Todo toggleCompleted(Long id) {
        Todo todo = findTodoById(id);
        todo.setCompleted(!Boolean.TRUE.equals(todo.getCompleted()));
        return todoRepository.save(todo);
    }

    private Todo findTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    private void copyRequestToTodo(TodoRequest request, Todo todo) {
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
    }
}
