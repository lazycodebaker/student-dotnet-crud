using Student.Data;
using Student.Services.StudentService;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigin = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!;

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "cors", policy =>
    {
        policy.WithOrigins(allowedOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IStudent, StudentService>();
builder.Services.AddDbContext<DataContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("cors");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
