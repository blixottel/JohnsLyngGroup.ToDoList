using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class ToDoController : ControllerBase
{
    private readonly ToDoService _service;

    public ToDoController(ToDoService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_service.GetAll());

    [HttpPost]
    public IActionResult Post([FromBody] string task)
    {
        if (string.IsNullOrWhiteSpace(task))
        {
            return BadRequest("Task cannot be empty or whitespace.");
        }

        try
        {
            var item = _service.Add(task);
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (_service.Remove(id))
            return NoContent();
        
        return NotFound();
    }
}