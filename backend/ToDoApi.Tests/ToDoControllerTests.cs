using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

public class ToDoControllerTests
{
    private readonly Mock<ToDoService> _mockService;
    private readonly ToDoController _controller;

    public ToDoControllerTests()
    {
        _mockService = new Mock<ToDoService>();
        _controller = new ToDoController(_mockService.Object);
    }

    [Fact]
    public void Get_ReturnsOkResult_WithListOfToDos()
    {
        // Arrange
        var todos = new List<ToDoItem>
        {
            new ToDoItem("Test Task 1") { Id = 1 },
            new ToDoItem("Test Task 2") { Id = 2 }
        };
        _mockService.Setup(service => service.GetAll()).Returns(todos);

        // Act
        var result = _controller.Get();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnTodos = Assert.IsAssignableFrom<IEnumerable<ToDoItem>>(okResult.Value);
        Assert.Equal(2, returnTodos.Count());
    }

    [Fact]
    public void Post_ValidTask_ReturnsCreatedResponse()
    {
        // Arrange
        var task = "New Task";
        var todoItem = new ToDoItem(task) { Id = 1 };
        _mockService.Setup(service => service.Add(task)).Returns(todoItem);

        // Act
        var result = _controller.Post(task);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, createdAtActionResult.StatusCode);
        Assert.Equal(todoItem, createdAtActionResult.Value);
    }

    [Fact]
    public void Delete_ExistingId_ReturnsNoContent()
    {
        // Arrange
        int idToDelete = 1;
        _mockService.Setup(service => service.Remove(idToDelete)).Returns(true);

        // Act
        var result = _controller.Delete(idToDelete);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public void Delete_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        int idToDelete = 999; // Non-existing ID
        _mockService.Setup(service => service.Remove(idToDelete)).Returns(false);

        // Act
        var result = _controller.Delete(idToDelete);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Post_InvalidTask_ReturnsBadRequest()
    {
        // Arrange
        string task = ""; // Invalid task

        // Act
        var result = _controller.Post(task);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        
        Assert.Equal("Task cannot be empty or whitespace.", badRequestResult.Value);
    }
}