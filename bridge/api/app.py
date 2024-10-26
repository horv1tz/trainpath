from fastapi import FastAPI, Request
import pika
import json
import uuid

app = FastAPI()

# Настройка подключения к RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='request_queue', durable=True)

@app.post("/enqueue")
async def enqueue_request(request: Request):
    request_data = await request.json()
    request_id = str(uuid.uuid4())
    
    # Публикуем запрос в очередь
    channel.basic_publish(
        exchange='',
        routing_key='request_queue',
        body=json.dumps({
            "id": request_id,
            "data": request_data
        }),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Устойчивое сообщение
        ))
    
    return {"status": "queued", "request_id": request_id}
