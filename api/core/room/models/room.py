from core.db.base.base import Base

from sqlalchemy import ForeignKey
from datetime import datetime
from .attachment import Attachment
from .message import Message

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
    validates
)

from .roles import RoleEnum

class Room(Base):
    __tablename__ = "room" 

    id: Mapped[int] = mapped_column(primary_key=True)

    is_active: Mapped[bool] = mapped_column(default=False)
    password: Mapped[str] = mapped_column(nullable=True)
    opening_time: Mapped[datetime] = mapped_column(nullable=False, default=datetime.utcnow)

    members: Mapped[list["User"]] = relationship(
        back_populates="rooms",
        secondary="room_user_association"
    )

    attachments: Mapped[list["Attachment"]] = relationship(
        back_populates="room",
        cascade="all, delete-orphan"
    )

    messages: Mapped[list["Message"]] = relationship(
        back_populates="room",
        cascade="all, delete-orphan"
    )

class RoomUserAssociation(Base):
    __tablename__ = "room_user_association"

    role: Mapped[RoleEnum] = mapped_column(
        nullable=False,
        default=RoleEnum.MEMBER
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"), 
        primary_key=True, 
    )

    room_id: Mapped[int] = mapped_column(
        ForeignKey("room.id", ondelete="CASCADE"), 
        primary_key=True, 
    )

    @validates("role")
    def validate_role(self, key, value):
        if value not in RoleEnum.__members__.values():
            raise ValueError(f"Некорректная роль: {value}")
        return value