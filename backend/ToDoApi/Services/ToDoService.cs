using System;
using System.Collections.Generic;
using System.Linq;

public class ToDoService
{
    private List<ToDoItem> _toDoItems = new List<ToDoItem>();
    private int _nextId = 1;

    public virtual IEnumerable<ToDoItem> GetAll() => _toDoItems;

    public virtual ToDoItem Add(string task)
    {
        if (string.IsNullOrWhiteSpace(task))
        {
            throw new ArgumentException("Task cannot be empty or whitespace.", nameof(task));
        }

        var item = new ToDoItem(task)
        {
            Id = _nextId++,
            IsCompleted = false
        };

        _toDoItems.Add(item);
        return item;
    }

    public virtual bool Remove(int id) 
    {
        var item = _toDoItems.FirstOrDefault(item => item.Id == id);
        if (item != null)
        {
            return _toDoItems.Remove(item);
        }
        return false;
    }
}