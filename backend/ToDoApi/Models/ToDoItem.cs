using System.ComponentModel.DataAnnotations;

public class ToDoItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Task cannot be empty.")]
    public string Task { get; set; }

    public bool IsCompleted { get; set; } = false;

    public ToDoItem(string task)
    {
       if (string.IsNullOrWhiteSpace(task))
       {
           throw new ArgumentException("Task cannot be empty or whitespace.", nameof(task));
       }
       
       Task = task;
   }
}